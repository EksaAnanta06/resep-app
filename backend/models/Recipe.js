const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Recipe = sequelize.define("Recipe", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        category: DataTypes.STRING,
        duration: DataTypes.INTEGER,
        kesulitan: DataTypes.TEXT,
        bahan: DataTypes.TEXT,
        caraMasak: DataTypes.TEXT,
        image_url: DataTypes.TEXT,
    }, {
        tableName: "recipes",
        timestamps: false,
    });

    return Recipe;
};
