import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/header/Header.jsx'
import { motion, AnimatePresence } from 'framer-motion'

// Modern Toast Notification Component
const Toast = ({ isOpen, onClose, message, type }) => {
    if (!isOpen) return null;

    // Auto close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div className={`max-w-md w-full rounded-lg shadow-lg ${bgColor} border p-4`}>
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {type === 'success' ? (
                                    <svg className={`w-5 h-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className={`w-5 h-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3 w-full">
                                <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500"
                            >
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AddRecipes = () => {
    const navigate = useNavigate();

    // Toast notification state
    const [toast, setToast] = useState({
        isOpen: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // redirect if not logged in
        }
    }, [navigate]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resep, setResep] = useState({
        title: '',
        category: '',
        duration: '',
        kesulitan: '',
        bahan: '',
        caraMasak: '',
        image_url: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResep(prev => ({ ...prev, [name]: value }));
    };

    const showToast = (message, type) => {
        setToast({
            isOpen: true,
            message,
            type
        });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:3000/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...resep,
                    duration: parseInt(resep.duration) || 0
                }),
            });

            const data = await response.json();
            if (response.ok) {
                showToast("Resep berhasil ditambahkan!", "success");
                // Navigate after a short delay to let the user see the success message
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                showToast(data.message || "Gagal menambahkan resep.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Terjadi kesalahan saat mengirim data.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const difficultyOptions = ["Mudah", "Sedang", "Sulit"];
    const categoryOptions = ["Breakfast", "Lunch", "Dinner"];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Toast Notification */}
            <Toast
                isOpen={toast.isOpen}
                onClose={closeToast}
                message={toast.message}
                type={toast.type}
            />

            {/* Main Content */}
            <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
                >
                    {/* Form Header */}
                    <div className="px-6 py-8 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                        <h2 className="text-2xl font-bold">Tambah Resep Baru</h2>
                        <p className="mt-2 text-teal-100">Bagikan resep masakan favoritmu dengan dunia!</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Resep Masakan</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={resep.title}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama resep masakan"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar Masakan</label>
                                    <input
                                        type="text"
                                        name="image_url"
                                        value={resep.image_url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                <div className="h-64">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bahan - Bahan</label>
                                    <textarea
                                        name="bahan"
                                        value={resep.bahan}
                                        onChange={handleChange}
                                        placeholder="Contoh format:
1. 250gr tepung terigu
2. 2 butir telur
3. 100ml air"
                                        className="w-full h-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Masakan</label>
                                    <select
                                        name="category"
                                        value={resep.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 bg-white"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Masak</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={resep.duration}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan</label>
                                        <select
                                            name="kesulitan"
                                            value={resep.kesulitan}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 bg-white"
                                        >
                                            <option value="">Kesulitan</option>
                                            {difficultyOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="h-64">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cara Masak</label>
                                    <textarea
                                        name="caraMasak"
                                        value={resep.caraMasak}
                                        onChange={handleChange}
                                        placeholder="Contoh format:
1. Campur semua bahan kering
2. Tambahkan telur dan air, aduk rata
3. Panggang selama 30 menit"
                                        className="w-full h-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-14 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 font-medium transition duration-200"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition duration-200 flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : "Simpan Resep"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddRecipes;