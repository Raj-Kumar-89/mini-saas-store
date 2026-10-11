const db = require("../config/db");

exports.addFavorite = async (req, res) => {
    try {
        const templateId = Number(req.params.templateId);

        if (!Number.isSafeInteger(templateId) || templateId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid template ID",
            });
        }

        const template = await db("templates").where({ id: templateId }).first("id");

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found",
            });
        }

        const [favorite] = await db("favorites").insert({
            user_id: req.user.id,
            template_id: templateId,
        })
        .onConflict(["user_id", "template_id"])
        .ignore()
        .returning(["id", "user_id", "template_id"]);

        if (!favorite) {
            return res.status(200).json({
                success: true,
                message: "Template is already in favorites",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Template added to favorites",
            favorite,
        });
    } catch (error) {
        console.error("Add favorite error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add favorite",
        });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await db("favorites").join(
            "templates",
            "favorites.template_id",
            "templates.id"
        )
        .where("favorites.user_id", req.user.id)
        .select(
            "templates.id",
            "templates.name",
            "templates.description",
            "templates.thumbnail_url",
            "templates.category",
            "favorites.created_at as favorited_at"
        )
        .orderBy("favorites.created_at", "desc");

        return res.status(200).json({
            success: true,
            count: favorites.length,
            favorites,
        });
    } catch (error) {
        console.error("Get favorites error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch favorites",
        });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const templateId = Number(req.params.templateId);

        if (!Number.isSafeInteger(templateId) || templateId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid template ID",
            });
        }

        const deletedCount = await db("favorites").where({
            user_id: req.user.id,
            template_id: templateId,
        }).del();

        if (deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Template removed from favorites",
        });
    } catch (error) {
        console.error("Remove favorite error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to remove favorite",
        });
    }
};