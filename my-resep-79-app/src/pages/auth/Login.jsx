import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/form/InputField";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '' });

    const validateForm = () => {
        const newErrors = {};

        if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setNotification({
                    show: true,
                    message: data.message || 'Login failed'
                });
                setIsLoading(false);
                return;
            }

            localStorage.setItem('token', data?.token);
            localStorage.setItem('user', data?.user.username);
            navigate('/');

        } catch (error) {
            console.error('Error:', error);
            setNotification({
                show: true,
                message: error.message || 'An error occurred during login'
            });
            setIsLoading(false);
        }
    };

    const ErrorNotification = () => {
        if (!notification.show) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full">
                    <div className="flex items-center justify-center mb-4">
                        <div className="rounded-full bg-red-100 p-3">
                            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-center text-red-800 mb-2">
                        Login Failed
                    </h3>

                    <div className="mb-6">
                        <p className="text-sm text-center text-gray-600">
                            {notification.message}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setNotification({ show: false, message: '' })}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <ErrorNotification />

            <div className="flex flex-col items-center mb-8">
                <img
                    className="w-16 h-16"
                    src="/pngwing 1.png"
                    alt="Logo resep 79"
                />
                <h1 className="mt-2 text-xl font-semibold text-gray-800">Buku Resep 79</h1>
            </div>

            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-400 py-4">
                    <h2 className="text-center text-2xl font-bold text-white">Log In</h2>
                </div>

                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            label="Username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-3 rounded-lg font-medium shadow-md hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-200 flex justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "Login"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-teal-500 hover:text-teal-600 font-medium transition duration-200">
                                Buat Dulu Dong!
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="flex items-center text-gray-600 hover:text-teal-500 text-sm transition duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Lupa password?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;