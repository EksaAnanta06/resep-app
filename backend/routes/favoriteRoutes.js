const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware/authMiddleware");
const { likeRecipe } = require("../controllers/favoriteController");
const { getUserFavorites } = require("../controllers/favoriteController");
const { unfavoriteRecipe } = require("../controllers/favoriteController");
const { getAllFavorite } = require("../controllers/favoriteController");

router.post("/:recipeId", authenticateToken, likeRecipe);
router.delete("/:recipeId", authenticateToken, unfavoriteRecipe);
router.get("/", authenticateToken, getUserFavorites);
router.get("/allFavorites", getAllFavorite)

module.exports = router;