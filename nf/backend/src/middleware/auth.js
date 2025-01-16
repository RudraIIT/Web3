import User from "../models/usermodel.js";
import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;
    // console.log(req.cookies);
    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Secret");
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user_id = req.user._id;
        const user = await User.findById(user_id);
        if (user && user.admin === true) {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Admins only" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { isAuthenticated, isAdmin };
