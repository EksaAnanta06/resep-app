import React, { useState, useEffect } from 'react'
import Header from '../../components/header/Header'
import RecipeCard from '../../components/RecipeCard/RecipeCard'
import { useNavigate } from 'react-router-dom';

export const ResepSaya = () => {
  const BASE_URL = 'https://learners-matching-rwanda-tariff.trycloudflare.com';

  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Cek apakah sudah login atau belum
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchRecipesAndFavorites();
  }, []);

  const fetchRecipesAndFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res1 = await fetch(`${BASE_URL}/recipes/myRecipes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res1.json();
      const res2 = await fetch(`${BASE_URL}/favorites`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const favoriteData = await res2.json();
      // Tandai mana yang jadi favorit
      const favoriteIds = favoriteData.map(fav => fav.id);
      const recipesWithFav = data.map(recipe => ({
        ...recipe,
        isFavorite: favoriteIds.includes(recipe.id)
      }));
      setRecipes(recipesWithFav);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/resep/edit/${id}`);
  };

  const handleDelete = async (id) => {
    // Buka popup konfirmasi dan simpan ID resep yang akan dihapus
    setRecipeToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/recipes/${recipeToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeToDelete));
        setShowDeletePopup(false);
      } else {
        setErrorMessage("Gagal menghapus resep.");
        setShowDeletePopup(false);
        setShowErrorPopup(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan saat menghapus resep.");
      setShowDeletePopup(false);
      setShowErrorPopup(true);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setRecipeToDelete(null);
  };

  const handleToggleFavorite = async (id) => {
    const token = localStorage.getItem("token");
    // Optimistic update
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
    try {
      const targetRecipe = recipes.find((r) => r.id === id);
      const method = targetRecipe?.isFavorite ? "DELETE" : "POST";
      await fetch(`${BASE_URL}/favorites/${id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Gagal update favorite:", err);
      // Rollback kalau gagal
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
        )
      );
    }
  };

  // Komponen Popup Delete
  const DeleteConfirmationPopup = () => {
    if (!showDeletePopup) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Konfirmasi Hapus Resep</h3>

          <div className="mb-6">
            <p className="text-sm text-center text-gray-500">
              Apakah Anda yakin ingin menghapus resep ini?
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={cancelDelete}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Komponen Popup Error
  const ErrorPopup = () => {
    if (!showErrorPopup) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Error</h3>

          <div className="mb-6">
            <p className="text-sm text-center text-gray-500">{errorMessage}</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowErrorPopup(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <Header />
      <main className='container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-[200px] mt-8 pb-7'>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Resep Saya</h1>
        {recipes.length === 0 ? (
          <p className="text-center text-gray-500">Kamu belum punya resep.</p>
        ) : (
          <div className="md:grid md:grid-cols-1 lg:grid-cols-4 flex flex-col justify-center items-center gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
      <DeleteConfirmationPopup />
      <ErrorPopup />
    </div>
  );
};

export default ResepSaya;