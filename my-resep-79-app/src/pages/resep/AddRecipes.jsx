import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/header/Header.jsx'

// Modern Popup Alert Component
const PopupAlert = ({ isOpen, onClose, message, type }) => {
    if (!isOpen) return null;

    // Auto close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 1000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
    const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className={`max-w-md w-full mx-4 rounded-lg shadow-lg ${bgColor} border p-4 transform transition-all`}>
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
                </div>
            </div>
        </div>
    );
};

const AddRecipes = () => {
    const navigate = useNavigate();

    // Popup alert state
    const [popup, setPopup] = useState({
        isOpen: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // redirect kalau belum login
        }
    }, [navigate]);

    const [resep, setResep] = useState({
        title: '',
        category: '',
        duration: 0,
        kesulitan: '',
        bahan: '',
        caraMasak: '',
        image_url: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResep(prev => ({ ...prev, [name]: value }));
    };

    const showPopup = (message, type) => {
        setPopup({
            isOpen: true,
            message,
            type
        });
    };

    const closePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(resep),
            });

            const data = await response.json();
            if (response.ok) {
                showPopup("Resep berhasil ditambahkan!", "success");
                // Navigate after a short delay to let the user see the success message
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                showPopup(data.message || "Gagal menambahkan resep.", "error");
            }
        } catch (err) {
            console.error(err);
            showPopup("Terjadi kesalahan saat mengirim data.", "error");
        }
    };

    return (
        <div className='min-h-screen flex flex-col bg-gray-100'>
            <Header />
            {/* Modern Popup Alert */}
            <PopupAlert
                isOpen={popup.isOpen}
                onClose={closePopup}
                message={popup.message}
                type={popup.type}
            />
            <form onSubmit={handleSubmit}
                className="flex-1 overflow-auto pt-7 pb-10 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-[200px] grid grid-cols-1 md:grid-cols-2 gap-7 text-[#787885]">
                <h2 className="text-3xl mb-5 text-center md:hidden">Tambah Resep</h2>
                {/* Kolom Kiri */}
                <div className="flex flex-col gap-7">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Resep Masakan</label>
                        <input
                            type="text"
                            name="title"
                            value={resep.title}
                            onChange={handleChange}
                            placeholder="Nama Resep Masakan"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Gambar Masakan</label>
                        <input
                            type="text"
                            name="image_url"
                            value={resep.image_url}
                            onChange={handleChange}
                            placeholder="URL Gambar Masakan"
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className='h-[100%]'>
                        <label className="block text-sm font-medium mb-1">Bahan - Bahan</label>
                        <textarea
                            name="bahan"
                            value={resep.bahan}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Daftar Bahan"
                            className="w-full px-3 py-2 border rounded resize-none h-[100%]"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex flex-col gap-7">
                    <div>
                        <label className="block text-sm font-medium mb-1">Kategori Masakan</label>
                        <select
                            name="category"
                            value={resep.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Waktu Masak</label>
                            <input
                                type="number"
                                name="duration"
                                value={resep.duration}
                                onChange={handleChange}
                                placeholder="(Harus Berupa Angka)"
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Tingkat Kesulitan</label>
                            <input
                                type="text"
                                name="kesulitan"
                                value={resep.kesulitan}
                                onChange={handleChange}
                                placeholder="Tingkat Kesulitan"
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className='h-[100%]'>
                        <label className="block text-sm font-medium mb-1">Cara Masak</label>
                        <textarea
                            name="caraMasak"
                            value={resep.caraMasak}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Cara Masak"
                            className="w-full px-3 py-2 border rounded resize-none h-[100%]"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Tombol */}
                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        type="button"
                        className="md:h-max px-6 py-2 border border-teal-500 text-teal-500 rounded hover:bg-teal-100"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="md:h-max px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddRecipes;