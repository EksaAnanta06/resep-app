const db = require("../models");
const Recipe = db.Recipe;
const { Op } = require("sequelize");

exports.createRecipes = async (req, res) => {
    const {
        title,
        category,
        duration,
        kesulitan,
        bahan,
        caraMasak,
        image_url,
    } = req.body;

    try {
        const newRecipe = await Recipe.create({
            user_id: req.user.id, // dari JWT token
            title,
            category,
            duration,
            kesulitan,
            bahan,
            caraMasak,
            image_url,
        });

        res.status(201).json({
            message: "Resep berhasil ditambahkan",
            recipe: newRecipe,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menambahkan resep" });
    }
}

exports.getMyRecipes = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await Recipe.findAll({
            where: { user_id: userId }
        });

        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil resep saya" });
    }
}

exports.searchAndPaginationsRecipes = async (req, res) => {
    const { page = 1, search = '' } = req.query;
    const limit = 8;
    const offset = (page - 1) * limit;

    const whereClause = search
        ? {
            title: {
                [Op.like]: `%${search}%`
            }
        }
        : {};

    try {
        const { count, rows } = await Recipe.findAndCountAll({
            where: whereClause,
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            recipes: rows,
            totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getRecipeById = async (req, res) => {
    const recipeId = req.params.id;

    try {
        const recipe = await Recipe.findByPk(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Resep tidak ditemukan" });
        }

        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil resep" });
    }
}

exports.updateRecipeById = async (req, res) => {
    const recipeId = req.params.id;
    const { title, category, duration, kesulitan, bahan, caraMasak, image_url } = req.body;

    try {
        const recipe = await Recipe.findByPk(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Resep tidak ditemukan" });
        }

        await recipe.update({
            title,
            category,
            duration,
            kesulitan,
            bahan,
            caraMasak,
            image_url
        });

        res.json({ message: "Resep berhasil diperbarui", recipe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal memperbarui resep" });
    }
}

exports.deleteRecipeById = async (req, res) => {
    const recipeId = req.params.id;

    try {
        const recipe = await Recipe.findByPk(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Resep tidak ditemukan" });
        }

        await recipe.destroy();

        res.json({ message: "Resep berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghapus resep" });
    }
}


exports.getMyRecipes = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await db.Favorite.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Recipe,
                    attributes: ["id", "title", "category", "image_url", "duration"]
                }
            ]
        });
        const recipes = await Recipe.findAll({
            where: { user_id: userId }
        });

        res.json(recipes, favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil resep saya" });
    }
}