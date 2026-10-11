const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addFavorite,
    getFavorites,
    removeFavorite,
} = require("../controllers/favoriteController");

router.use(authMiddleware);

router.get("/", getFavorites);
router.post("/:templateId", addFavorite);
router.delete("/:templateId", removeFavorite);

module.exports = router;
