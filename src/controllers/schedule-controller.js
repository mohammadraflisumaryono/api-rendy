const Joi = require("joi");
const ScheduleModel = require("../models/schedule-model");

class ScheduleController {

    // Handler untuk mendapatkan semua schedule
    static async getAllSchedule(req, res) {
        try {
            const items = await ScheduleModel.getAllItems();

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


    // // Handler untuk insert schedule
    static async postScheduleHandler(req, res) {
        try {
            const { body } = req;
            const schema = Joi.object({
                //    `jam` time NOT NULL,
                //     `status` boolean

                jam: Joi.string().required(),
                status: Joi.boolean().required(),

            });

            const { error } = schema.validate(body);

            if (error) {
                return res.status(400).json({
                    status: "fail",
                    message: error.message
                });
            }

            const newItem = await ScheduleModel.insertItem(body);

            res.status(201).json({
                status: "success",
                data: newItem,
                message: "Data inserted successfully",
            });
        }
        catch (error) {
            console.error("Error inserting item:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error"
            });
        }
    }

    // Handler untuk delete 
    static async deleteScheduleHandler(req, res) {
        try {
            const { id } = req.params;

            const deletedItem = await ScheduleModel.deleteItem(id);

            if (deletedItem.affectedRows) {
                return res.status(200).json({
                    status: "success",
                    message: "Data deleted successfully",
                });
            }

            res.status(404).json({
                status: "fail",
                message: "Data not found",
            });
        } catch (error) {
            console.error("Error deleting item:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error"
            });
        }
    }

}

module.exports = ScheduleController;
