const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        nama_lengkap: DataTypes.STRING,
    }, {
        tableName: "users",
        timestamps: false,
    });

    return User;
};
