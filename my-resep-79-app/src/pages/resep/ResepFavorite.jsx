import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import RecipeCard from '../../components/RecipeCard/RecipeCard';

const ResepFavorite = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      fetch('http://localhost:3000/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          // Tambahin isFavorite: true ke setiap resep
          const withIsFavorite = data.map(recipe => ({
            ...recipe,
            isFavorite: true
          }));

          setFavorites(withIsFavorite);
        })
        .catch(err => {
          console.error('Gagal ambil data favorites:', err);
        });
    }
  }, [navigate]);

  const handleToggleFavorite = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/favorites/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Hapus dari state local
        setFavorites(prev => prev.filter(recipe => recipe.id !== id));
      } else {
        console.error("Gagal menghapus dari favorit");
      }
    } catch (err) {
      console.error("Error unfavoriting:", err);
    }
  };


  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <main className='container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-[200px] mt-8 pb-7'>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Resep Favorite</h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">Kamu belum punya resep favorit.</p>
        ) : (
          <div className="md:grid md:grid-cols-1 lg:grid-cols-4 flex flex-col justify-center items-center gap-6">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResepFavorite;
