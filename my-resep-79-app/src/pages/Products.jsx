import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header.jsx";
import RecipeControls from "../components/recipecontrols/RecipeControls.jsx";
import RenderRecipes from "../components/RecipeCard/RenderRecipes.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const navigate = useNavigate();

  const [totalPages, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch recipes and favorites
  const fetchRecipesAndFavorites = useCallback(async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError(null);

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

      if (!res1.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const recipeData = await res1.json();

      // Fetch favorites
      const res2 = await fetch(`http://localhost:3000/favorites`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res2.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const favoriteData = await res2.json();
      const favoriteIds = favoriteData.map((fav) => fav.id);

      // Combine isFavorite with each recipe
      const recipesWithFavorite = recipeData.recipes.map((recipe) => ({
        ...recipe,
        isFavorite: favoriteIds.includes(recipe.id)
      }));

      setTotalPage(recipeData.totalPages);
      setRecipes(recipesWithFavorite);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchRecipesAndFavorites();
  }, [fetchRecipesAndFavorites, refreshKey]);

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

      const response = await fetch(`http://localhost:3000/favorites/${id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
      // Rollback if failed
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
        )
      );
    }
  };

  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Modern pagination component
  const Pagination = () => {
    // Maximum number of pagination buttons to show
    const maxButtons = 5;

    // Calculate which page numbers to show
    const getPageNumbers = () => {
      let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
      let endPage = startPage + maxButtons - 1;

      // Adjust if we're near the end
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      const pageNumbers = [];
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    };

    return (
      <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
        {/* Previous page button */}
        <button
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${page === 1
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 hover:bg-[#01BFBF]/10 transition-colors'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* First page if not in view */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => setPage(1)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-[#01BFBF]/10 transition-colors"
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="flex items-center justify-center w-10 h-10">...</span>
            )}
          </>
        )}

        {/* Page number buttons */}
        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${page === num
                ? 'bg-[#01BFBF] text-white font-medium shadow-md'
                : 'text-gray-700 hover:bg-[#01BFBF]/10'
              }`}
          >
            {page === num && (
              <motion.div
                layoutId="activePage"
                className="absolute inset-0 bg-[#01BFBF] rounded-full z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="z-10">{num}</span>
          </button>
        ))}

        {/* Last page if not in view */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="flex items-center justify-center w-10 h-10">...</span>
            )}
            <button
              onClick={() => setPage(totalPages)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-[#01BFBF]/10 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next page button */}
        <button
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${page === totalPages
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 hover:bg-[#01BFBF]/10 transition-colors'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  };

  // Placeholder shimmer effect for loading state
  const RecipeCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md w-[85%] md:w-[250px] h-[276px] overflow-hidden">
      <div className="h-[142px] w-full bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-3 w-16 bg-gray-200 rounded-full animate-pulse mb-2" />
        <div className="h-5 w-36 bg-gray-200 rounded-full animate-pulse mb-3" />
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="mt-4 h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {[...Array(8)].map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-md mx-auto max-w-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center mb-6">{message || "Failed to load recipes"}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-[#01BFBF] text-white rounded-lg hover:bg-[#01BFBF]/90 transition-colors shadow-md"
      >
        Try Again
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <img
        src="/empty-recipe.svg"
        alt="No recipes found"
        className="w-48 h-48 mb-6 opacity-60"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/192?text=No+Recipes";
        }}
      />
      <h3 className="text-xl font-medium text-gray-700 mb-2">No Recipes Found</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        We couldn't find any recipes matching your search criteria. Try different keywords or browse all recipes.
      </p>
      <button
        onClick={() => setSearch("")}
        className="px-6 py-2 bg-[#01BFBF] text-white rounded-lg hover:bg-[#01BFBF]/90 transition-colors shadow-md"
      >
        View All Recipes
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 md:px-8 lg:px-[200px] mt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Discover Recipes</h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Explore our collection of delicious recipes and find your next culinary masterpiece
            </p>
          </div>

          <RecipeControls search={search} setSearch={setSearch} />
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <SkeletonGrid />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <ErrorMessage message={error} onRetry={refreshData} />
            </motion.div>
          ) : recipes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <RenderRecipes
                recipes={recipes}
                onToggleFavorite={handleToggleFavorite}
              />

              {totalPages > 1 && <Pagination />}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center text-gray-600 text-sm"
        >
          <p>Showing page {page} of {totalPages} • {recipes.length} recipes</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Products;