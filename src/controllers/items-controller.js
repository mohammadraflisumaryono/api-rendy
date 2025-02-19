const Joi = require("joi");
const ItemsModel = require("../models/items-model");

class ItemsController {
    // Handler untuk menambahkan item baru
    static async postItemHandler(req, res) {
        try {
            // Validasi input menggunakan Joi
            const schema = Joi.object({
                suhu: Joi.string().trim().required(),
                ph: Joi.string().trim().required(),
                turbidity: Joi.string().trim().required(),
                tds: Joi.string().trim().required(),
            });

            const { error, value } = schema.validate(req.body, { abortEarly: false });

            if (error) {
                return res.status(400).json({
                    status: "fail",
                    message: error.details.map(err => err.message).join(", "),
                });
            }

            // Pastikan semua nilai tidak kosong
            const newItem = await ItemsModel.insertItem({
                suhu: value.suhu || "",
                ph: value.ph || "",
                turbidity: value.turbidity || "",
                tds: value.tds || "",
                created_at: new Date(),
                updated_at: new Date(),
            });

            res.status(201).json({
                status: "success",
                data: newItem,
                message: "Data added successfully",
            });
        } catch (error) {
            console.error("Error adding item:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    // Handler untuk mendapatkan semua item
    static async getAllItemsHandler(req, res) {
        try {
            const items = await ItemsModel.getAllItems();

            res.status(200).json({
                status: "success",
                data: items,
                message: "Data retrieved successfully",
            });
        } catch (error) {
            console.error("Error retrieving items:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error"
            });
        }
    }
}

module.exports = ItemsController;
