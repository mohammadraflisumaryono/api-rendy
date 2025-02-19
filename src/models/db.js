const mysql = require("mysql2/promise");
require("dotenv").config();
const logger = require("pino")();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME || !DB_PORT) {
    throw new Error("Missing required database environment variables.");
}

const config = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
};

const db = mysql.createPool(config);

db.getConnection()
    .then(() => logger.info(`DB Connected: ${JSON.stringify(config)}`))
    .catch((err) => {
        logger.error(`DB connection error: ${err.message}`);
        process.exit(1); // Keluar dari proses jika koneksi DB gagal
    });

const validatePayload = (payload) => {
    if (typeof payload !== "object" || payload === null) {
        throw new Error("Payload must be a valid object.");
    }
};

const commonQueryInsert = async (tableName, payload) => {
    validatePayload(payload);

    const columns = Object.keys(payload).join(", ");
    const values = Object.values(payload);
    const placeholders = Object.keys(payload).map(() => "?").join(", ");

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    try {
        const [result] = await db.execute(query, values);
        const insertedId = result.insertId;
        return await commonQueryGetOne(tableName, { id: insertedId });
    } catch (err) {
        logger.error({ query, values, message: err.message }, "Database Insert Error");
        throw err;
    }
};

const commonQueryGetAll = async (tableName) => {
    const query = `SELECT * FROM ${tableName} ORDER BY COALESCE(updated_at, created_at) DESC, id DESC`;
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (err) {
        logger.error("Error executing query:", err.message);
        throw err;
    }
};

const commonQueryGetOne = async (tableName, payload, optionalQuery = "") => {
    let whereClause = "1=1";
    const values = [];

    for (const [key, value] of Object.entries(payload)) {
        whereClause += ` AND ${key} = ?`;
        values.push(value);
    }

    const query = `SELECT * FROM ${tableName} WHERE ${whereClause} ${optionalQuery}`;
    try {
        const [rows] = await db.execute(query, values);
        return rows[0] || null;
    } catch (err) {
        logger.error("Error executing query:", err.message);
        throw err;
    }
};

const commonQueryUpdate = async (tableName, identity, payload) => {
    validatePayload(payload);

    const setClause = Object.keys(payload).map((key) => `${key} = ?`).join(", ");
    const whereClause = Object.keys(identity).map((key) => `${key} = ?`).join(" AND ");

    const values = [...Object.values(payload), ...Object.values(identity)];

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;

    try {
        await db.execute(query, values);
        return await commonQueryGetOne(tableName, identity);
    } catch (err) {
        logger.error("Error executing query:", err.message);
        throw err;
    }
};

const commonQueryDelete = async (tableName, identity) => {
    const existingData = await commonQueryGetOne(tableName, identity);
    if (!existingData) {
        return { message: "No data found to delete", deletedData: null };
    }

    const whereClause = Object.keys(identity).map((key) => `${key} = ?`).join(" AND ");
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;

    try {
        await db.execute(query, Object.values(identity));
        return { message: "Data successfully deleted", deletedData: existingData };
    } catch (err) {
        logger.error("Error executing query:", err.message);
        throw err;
    }
};

module.exports = {
    db,
    commonQueryGetAll,
    commonQueryGetOne,
    commonQueryInsert,
    commonQueryUpdate,
    commonQueryDelete,
};
