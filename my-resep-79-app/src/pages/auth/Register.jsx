import React, { useState } from 'react';
import { Link } from "react-router-dom";
import InputField from "../../components/form/InputField";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const validateForm = () => {
        const newErrors = {};

        if (formData.username.length < 3) {
            newErrors.username = 'Username harus lebih dari 3 karakter';
        }

        if (formData.fullName.length < 3) {
            newErrors.fullName = 'Full name harus lebih dari 3 karakter';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password harus lebih dari 6 karakter';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords tidak sama';
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
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    namaLengkap: formData.fullName,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setNotification({
                    show: true,
                    type: 'error',
                    message: data.message || 'Registration gagal'
                });
                return;
            }

            setNotification({
                show: true,
                type: 'berhasil',
                message: 'Registrasi berhasil! Gas login'
            });

            // Reset form after successful registration
            setFormData({
                username: '',
                fullName: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            console.error('Error:', error);
            setNotification({
                show: true,
                type: 'error',
                message: 'Terjadi kesalahan saat registrasi'
            });
        } finally {
            setIsLoading(false);
        }
    };

    

    const Notification = () => {
        if (!notification.show) return null;

        const bgColor = notification.type === 'berhasil' ? 'bg-green-100' : 'bg-red-100';
        const textColor = notification.type === 'berhasil' ? 'text-green-800' : 'text-red-800';
        const iconColor = notification.type === 'berhasil' ? 'text-green-500' : 'text-red-500';

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full">
                    <div className="flex items-center justify-center mb-4">
                        <div className={`rounded-full ${bgColor} p-3`}>
                            {notification.type === 'berhasil' ? (
                                <svg className={`h-6 w-6 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className={`h-6 w-6 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>
                    </div>

                    <h3 className={`text-lg font-medium text-center ${textColor} mb-2`}>
                        {notification.type === 'berhasil' ? 'Success!' : 'Registrasi Gagal'}
                    </h3>

                    <div className="mb-6">
                        <p className="text-sm text-center text-gray-600">
                            {notification.message}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setNotification({ ...notification, show: false })}
                            className={`${notification.type === 'berhasil' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded transition-colors duration-200 text-sm font-medium`}
                        >
                            {notification.type === 'berhasil' ? 'Gas' : 'Tutup'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <Notification />

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
                    <h2 className="text-center text-2xl font-bold text-white">Buat Akun</h2>
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
                            error={errors.username}
                        />

                        <InputField
                            label="Full Name"
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                        />

                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <InputField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
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
                                ) : "Daftar"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-teal-500 hover:text-teal-600 text-sm font-medium transition duration-200">
                            Sudah punya akun? Gas log-in!
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;