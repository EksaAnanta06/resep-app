import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header.jsx";
import RecipeControls from "../components/recipecontrols/RecipeControls.jsx";
import RenderRecipes from "../components/RecipeCard/RenderRecipes.jsx";

const Products = () => {
  const navigate = useNavigate();

  const [totalPages, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Cek login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch recipes + favorite lalu gabungkan
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRecipesAndFavorites = async () => {
      try {
        // Fetch recipes
        const res1 = await fetch(
          `http://localhost:3000/recipes?page=${page}&search=${debouncedSearch}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const recipeData = await res1.json();
        console.log(recipeData);
        // Fetch favorites
        const res2 = await fetch(`http://localhost:3000/favorites`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const favoriteData = await res2.json();
        const favoriteIds = favoriteData.map((fav) => fav.id);

        // Gabungkan isFavorite ke masing-masing recipe
        const recipesWithFavorite = recipeData.recipes.map((recipe) => ({
          ...recipe,
          isFavorite: favoriteIds.includes(recipe.id)
        }));

        setTotalPage(recipeData.totalPages);
        setRecipes(recipesWithFavorite);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchRecipesAndFavorites();
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded ${page === i ? "bg-[#01BFBF] text-white" : "text-gray-500"
            }`}
        >
          {i}
        </button>
      );
    }

    return pages;
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

      await fetch(`http://localhost:3000/favorites/${id}`, {
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

  


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 md:px-8 lg:px-[200px] mt-8 pb-7">
        <RecipeControls search={search} setSearch={setSearch} />
        <h2 className="text-2xl mb-4 text-center hidden md:block ">Daftar Resep Masakan</h2>
        <RenderRecipes
          recipes={recipes}
          onToggleFavorite={handleToggleFavorite} />
        <div className="mt-5 flex justify-center py-4 overflow-scroll">
          <div className="flex space-x-2">{renderPagination()}</div>
        </div>
      </main>
    </div>
  );
};

export default Products;
