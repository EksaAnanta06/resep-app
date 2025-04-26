import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header.jsx";

const DetailProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState(false);
    const [recipe, setRecipe] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeAndFavoriteStatus = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            try {
                // Fetch resep detail
                const res1 = await fetch(`http://localhost:3000/recipes/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const recipeData = await res1.json();
                setRecipe(recipeData);

                // Kalau ada token (user login), cek juga favoritnya
                if (token) {
                    const res2 = await fetch(`http://localhost:3000/favorites`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const favoriteData = await res2.json();
                    const favoriteIds = favoriteData.map(fav => fav.id);

                    // Cek apakah resep ini termasuk favorit
                    const isFavorite = favoriteIds.includes(recipeData.id);
                    setFavorites(isFavorite);
                }
            } catch (error) {
                console.error("Error fetching recipe or favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeAndFavoriteStatus();
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const toggleFavorite = async () => {
        try {
            const response = await fetch(`http://localhost:3000/favorites/${id}`, {
                method: favorites ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                setFavorites(!favorites);
            } else {
                alert("Terjadi kesalahan!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6">
                {/* Back button and title */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 mr-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 4L7 12L15 20" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 truncate flex-1">{recipe.title}</h1>
                    <button
                        onClick={toggleFavorite}
                        className={`p-2 rounded-full ${favorites ? 'bg-red-50' : 'bg-white'} shadow hover:bg-gray-100 transition-colors`}
                    >
                        {favorites ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#FF4081" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="#FF4081" strokeWidth="2" fill="none" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Recipe image */}
                <div className="rounded-xl overflow-hidden shadow-lg mb-8">
                    {recipe.image_url ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-64 md:h-96 object-cover"
                        />
                    ) : (
                        <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gradient-to-r from-teal-400 to-cyan-500 text-center text-xl font-bold text-white">
                            {recipe.title}
                        </div>
                    )}
                </div>

                {/* Recipe info cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-gray-500 text-sm">Kategori</h2>
                        <p className="text-lg font-semibold text-teal-600">{recipe.category}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="#01BFBF" strokeWidth="2" />
                                <path d="M12 6V12L16 14" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-gray-500 text-sm">Waktu Masak</h2>
                        <p className="text-lg font-semibold text-teal-600">{recipe.duration} menit</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center col-span-2 sm:col-span-1">
                        <div className="bg-teal-100 p-3 rounded-full mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 9L13 3L5 11V21H15L19 9Z" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 15H9.01" stroke="#01BFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-gray-500 text-sm">Tingkat Kesulitan</h2>
                        <p className="text-lg font-semibold text-teal-600">{recipe.kesulitan}</p>
                    </div>
                </div>

                {/* Recipe content */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b">
                        <button className="flex-1 py-4 text-center font-medium text-teal-600 border-b-2 border-teal-500">
                            Resep
                        </button>
                    </div>

                    {/* Ingredients */}
                    <div className="p-6">
                        <h2 className="flex items-center text-xl font-bold text-gray-800 mb-4">
                            <svg className="w-6 h-6 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Bahan-Bahan
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 whitespace-pre-line">
                            {recipe.bahan}
                        </div>

                        {/* Instructions */}
                        <h2 className="flex items-center text-xl font-bold text-gray-800 mb-4">
                            <svg className="w-6 h-6 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            Cara Memasak
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                            {recipe.caraMasak}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailProduct;