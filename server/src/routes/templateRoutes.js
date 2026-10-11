const express = require("express");
const router = express.Router();

const {
    getAllTemplates,
    getTemplateById,
} = require("../controllers/templateController");

router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);

module.exports = router;