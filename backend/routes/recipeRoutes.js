const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware/authMiddleware");
const { createRecipes } = require("../controllers/recipeController");
const { getMyRecipes } = require("../controllers/recipeController");
const { searchAndPaginationsRecipes }  = require("../controllers/recipeController");
const { getRecipeById } = require("../controllers/recipeController");
const { deleteRecipeById } = require("../controllers/recipeController");
const { updateRecipeById } = require("../controllers/recipeController");

// router.get("/", authenticateToken, getAllRecipes);
router.post("/", authenticateToken, createRecipes);
router.get("/myRecipes", authenticateToken, getMyRecipes);
router.get("/", searchAndPaginationsRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", authenticateToken, deleteRecipeById);
router.patch("/:id", authenticateToken, updateRecipeById);

module.exports = router;