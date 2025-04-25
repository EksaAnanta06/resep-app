const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import semua model
db.User = require("./User")(sequelize);
db.Recipe = require("./Recipe")(sequelize);
db.Favorite = require("./Favorite")(sequelize);

// Setup relasi
db.User.hasMany(db.Recipe, { foreignKey: "user_id" });
db.Recipe.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Favorite, { foreignKey: "user_id" });
db.Recipe.hasMany(db.Favorite, { foreignKey: "recipe_id" });

db.Favorite.belongsTo(db.User, { foreignKey: "user_id" });
db.Favorite.belongsTo(db.Recipe, { foreignKey: "recipe_id" });

module.exports = db;

db.sequelize.sync({ alter: false }) // atau { force: false }
    .then(() => {
        console.log("✅ Database & tabel sudah sinkron");
    })
    .catch((err) => {
        console.error("❌ Gagal sinkron database:", err);
    });
