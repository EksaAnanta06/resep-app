const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

exports.register = async (req, res) => {
    const { username, password, nama_lengkap } = req.body;

    try {
        const existing = await User.findOne({ where: { username } });
        if (existing) return res.status(400).json({ message: "Gagal, Username sudah digunakan!" });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password_hash: hashed,
            nama_lengkap,
        });

        res.status(201).json({ message: "User berhasil dibuat", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat register" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: "Username tidak ditemukan" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Password salah coba lagi!" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "2d",
        });

        res.json({ message: "Login berhasil", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat login" });
    }
};
