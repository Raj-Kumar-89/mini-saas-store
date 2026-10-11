const db = require("../config/db");

exports.getAllTemplates = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = db("templates").select(
            "id",
            "name",
            "description",
            "thumbnail_url",
            "category",
            "created_at"
        );

        if (typeof search === "string" && search.trim()) {
            const term = `%${search.trim()}%`;

            query = query.where((builder) => {
                builder.whereILike("name", term).orWhereILike("description", term);
            });
        }

        if (typeof category === "string" && category.trim()) {
            query = query.where(
                "category",
                category.trim()
            );
        }

        const templates = await query.orderBy("id", "asc");

        return res.status(200).json({
            success: true,
            count: templates.length,
            templates,
        });
    } catch (error) {
        console.error("Get templates error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch templates",
        });
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid template ID",
            });
        }

        const template = await db("templates").select(
            "id",
            "name",
            "description",
            "thumbnail_url",
            "category",
            "created_at"
        ).where({ id }).first();

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found",
            });
        }

        return res.status(200).json({
            success: true,
            template,
        });
    } catch (error) {
        console.error("Get template error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch template",
        });
    }
};