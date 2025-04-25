const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

require("dotenv").config();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favorites", favoriteRoutes);


app.listen(3000, () => {
    console.log("🚀 Server jalan di http://localhost:3000");
});
