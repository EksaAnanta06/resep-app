import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header.jsx";

const DetailProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState(false);

    const [recipe, setRecipe] = useState([]);

    useEffect(() => {
        const fetchRecipeAndFavoriteStatus = async () => {
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
                method: favorites ? "DELETE" : "POST", // Menggunakan POST untuk menambah, DELETE untuk menghapus
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                setFavorites(!favorites);  // Toggle state favorite
            } else {
                alert("Terjadi kesalahan!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 pb-10'>
            <Header />
            <main className="flex justify-center px-4">
                <div className="flex flex-col w-full max-w-xl mt-5 md:mt-10 overflow-y-auto">
                    <div className="flex justify-center items-center gap-1">
                        <button onClick={() => navigate(-1)} className="p-1">
                            <svg width="24" height="24" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
                                <path d="M25.5031 4.97749C24.7681 4.24249 23.5831 4.24249 22.8481 4.97749L10.3831 17.4425C9.79809 18.0275 9.79809 18.9725 10.3831 19.5575L22.8481 32.0225C23.5831 32.7575 24.7681 32.7575 25.5031 32.0225C26.2381 31.2875 26.2381 30.1025 25.5031 29.3675L14.6431 18.4925L25.5181 7.61749C26.2381 6.89749 26.2381 5.69749 25.5031 4.97749Z" fill="black" />
                            </svg>
                        </button>
                        <h1 className="text-xl md:text-2xl truncate">{recipe.title}</h1>
                    </div>

                    <div className="flex flex-col items-center justify-center mt-4 md:mt-5">
                        {recipe.image_url ? (
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                className="w-full max-w-md h-40 sm:h-48 md:h-64 object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-full max-w-md h-40 sm:h-48 md:h-64 flex items-center justify-center bg-gray-300 text-center text-lg font-semibold text-gray-700 rounded-md">
                                {recipe.title}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center mt-4 md:mt-5">
                        <div className="border border-[#01BFBF] rounded-md w-full max-w-md p-2">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <h1 className="font-serif text-sm md:text-base">Kategori</h1>
                                    <p className="text-[#01BFBF] text-sm md:text-base">{recipe.category}</p>
                                </div>
                                <div>
                                    <h1 className="font-serif text-sm md:text-base">Waktu Masak</h1>
                                    <p className="text-[#01BFBF] text-sm md:text-base">{recipe.duration} menit</p>
                                </div>
                                <div>
                                    <h1 className="font-serif text-sm md:text-base">Kesulitan</h1>
                                    <p className="text-[#01BFBF] text-sm md:text-base">{recipe.kesulitan}</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <button onClick={toggleFavorite}>
                                        {favorites ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6">
                                                <path d="M12.0003 17.5196L16.1503 20.0296C16.9103 20.4896 17.8403 19.8096 17.6403 18.9496L16.5403 14.2296L20.2103 11.0496C20.8803 10.4696 20.5203 9.36958 19.6403 9.29958L14.8103 8.88958L12.9203 4.42958C12.5803 3.61958 11.4203 3.61958 11.0803 4.42958L9.19032 8.87958L4.36032 9.28958C3.48032 9.35958 3.12032 10.4596 3.79032 11.0396L7.46032 14.2196L6.36032 18.9396C6.16032 19.7996 7.09032 20.4796 7.85032 20.0196L12.0003 17.5196Z" fill="#01BFBF" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M14.8084 8.87461L19.6484 9.29461C20.5284 9.36461 20.8784 10.4646 20.2084 11.0446L16.5384 14.2246L17.6384 18.9546C17.8384 19.8146 16.9084 20.4946 16.1484 20.0346L11.9984 17.5246L7.84836 20.0246C7.08836 20.4846 6.15836 19.8046 6.35836 18.9446L7.45836 14.2246L3.78836 11.0446C3.11836 10.4646 3.47836 9.36461 4.35836 9.29461L9.18836 8.88461L11.0784 4.42461C11.4184 3.61461 12.5784 3.61461 12.9184 4.42461L14.8084 8.87461ZM8.23836 17.9246L11.9984 15.6546L15.7684 17.9346L14.7684 13.6546L18.0884 10.7746L13.7084 10.3946L11.9984 6.35461L10.2984 10.3846L5.91836 10.7646L9.23836 13.6446L8.23836 17.9246Z" fill="#01BFBF" />
                                            </svg>
                                        )}
                                    </button>
                                    <h1 className="font-serif text-sm md:text-base">Favorite</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mt-4 md:mt-5 w-full px-2 md:px-4 gap-4 mb-10">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-lg md:text-xl text-[#01BFBF]">Bahan Bahan</h1>
                            <div className="w-full h-0.5 md:h-[3px] bg-gray-500"></div>
                            <p className="text-sm md:text-base">
                                {recipe.bahan}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-lg md:text-xl text-[#01BFBF]">Cara Masak</h1>
                            <div className="w-full h-0.5 md:h-[3px] bg-gray-500"></div>
                            <p className="text-sm md:text-base">
                                {recipe.caraMasak}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailProduct;
