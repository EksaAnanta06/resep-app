import React from 'react'
import RecipeCard from './RecipeCard'

export const RenderRecipes = ({ recipes, onToggleFavorite }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {recipes?.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} onToggleFavorite={onToggleFavorite} />
            ))}
        </div>
    )
}

export default RenderRecipes