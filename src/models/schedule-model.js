const { commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./db");

const tableName = "jadwal";

class ScheduleModel {
    static async getAllItems() {
        return commonQueryGetAll(tableName);
    }

    static async getItemById(id) {
        return commonQueryGetOne(tableName, { id });
    }

    static async insertItem(data) {
        return commonQueryInsert(tableName, data);
    }

    static async updateItem(id, data) {
        return commonQueryUpdate(tableName, { id }, data);
    }

    static async deleteItem(id) {
        return commonQueryDelete(tableName, { id });
    }
}

module.exports = ScheduleModel;
