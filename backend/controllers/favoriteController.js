const db = require("../models");
const Favorite = db.Favorite;

exports.likeRecipe = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    try {
        // Cek apakah sudah difavoritkan sebelumnya
        const existing = await Favorite.findOne({
            where: { user_id: userId, recipe_id: recipeId }
        });

        if (existing) {
            return res.status(400).json({ message: "Resep sudah difavoritkan" });
        }

        const favorite = await Favorite.create({
            user_id: userId,
            recipe_id: recipeId
        });

        res.status(201).json({ message: "Resep berhasil difavoritkan", favorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menambahkan favorite" });
    }
};

exports.getUserFavorites = async (req, res) => {
    const userId = req.user.id;

    try {
        const favorites = await db.Favorite.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Recipe,
                    attributes: ["id", "title", "category", "image_url", "duration", ]
                }
            ]
        });

        res.json(favorites.map(fav => fav.Recipe)); // Kirim hanya data resepnya
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil resep favorit" });
    }
};

exports.unfavoriteRecipe = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    try {
        const favorite = await Favorite.findOne({
            where: { user_id: userId, recipe_id: recipeId },
        });

        if (!favorite) {
            return res.status(404).json({ message: "Resep tidak ditemukan di daftar favorit" });
        }

        await favorite.destroy();
        res.json({ message: "Resep berhasil dihapus dari favorit" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghapus dari favorit" });
    }
};

exports.getAllFavorite = async (req, res) => {
    try {
        const favorites = await Favorite.findAll();
        res.json(favorites); // Kirim hanya data favorite
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil semua resep favorit" });
    }
}