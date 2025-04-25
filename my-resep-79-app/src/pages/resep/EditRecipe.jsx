import React, { useState, useEffect } from 'react'
import Header from '../../components/header/Header';
import { useNavigate, useParams } from 'react-router-dom';

export const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const [resep, setResep] = useState({
        title: '',
        category: '',
        duration: 0,
        kesulitan: '',
        bahan: '',
        caraMasak: '',
        image_url: '',
    });

    useEffect(() => {
        fetch(`http://localhost:3000/recipes/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setResep(data);
            })
            .catch(err => {
                console.error(err);
                showNotification('Gagal memuat data resep', 'error');
            });
    }, [id]);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResep(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/recipes/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(resep),
            });

            const data = await response.json();
            if (response.ok) {
                showNotification("Resep berhasil diperbarui!");
                setTimeout(() => navigate("/"), 600);
            } else {
                showNotification(data.message || "Gagal memperbarui resep.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Terjadi kesalahan saat mengirim data.", "error");
        }
    };

    return (
        <div className='min-h-screen flex flex-col bg-gray-100'>
            <Header />

            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                    <p>{notification.message}</p>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-auto pt-7 pb-10 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-[200px] grid grid-cols-1 md:grid-cols-2 gap-7 text-[#787885]"
            >
                <h2 className="text-3xl mb-5 text-center md:hidden">Edit Resep</h2>
                {/* Kolom Kiri */}
                <div className="flex flex-col gap-7">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Resep Masakan</label>
                        <input
                            onFocus={(e) => {
                                setTimeout(() => {
                                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 300);
                            }}
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

                    <div className='h-full'>
                        <label className="block text-sm font-medium mb-1">Bahan - Bahan</label>
                        <textarea
                            name="bahan"
                            value={resep.bahan}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Daftar Bahan"
                            className="w-full px-3 py-2 border rounded resize-none h-full"
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
                                onFocus={(e) => {
                                    setTimeout(() => {
                                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 300);
                                }}
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
                                onFocus={(e) => {
                                    setTimeout(() => {
                                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 300);
                                }}
                                type="text"
                                name="kesulitan"
                                value={resep.kesulitan}
                                onChange={handleChange}
                                placeholder="Tingkat Kesulitan"
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className='h-full'>
                        <label className="block text-sm font-medium mb-1">Cara Masak</label>
                        <textarea
                            onFocus={(e) => {
                                setTimeout(() => {
                                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 300);
                            }}
                            name="caraMasak"
                            value={resep.caraMasak}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Cara Masak"
                            className="w-full px-3 py-2 border rounded resize-none h-full"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Tombol */}
                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        type="button"
                        className="h-max px-6 py-2 border border-teal-500 text-teal-500 rounded hover:bg-teal-100"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="h-max px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    >
                        Edit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditRecipe;