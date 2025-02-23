const axios = require("axios");
const cron = require("node-cron");
const ScheduleModel = require("../models/schedule-model");

// URL API IoT (ganti dengan URL yang sesuai)
const IOT_API_URL = "http://iot-device.local/api/update";

async function updateIoTStatus(id, status) {
    console.log(`Mengupdate status IoT untuk ID ${id}: ${status}`);

    try {
        // Kirim status ke API IoT
        const response = await axios.post(IOT_API_URL, {
            id,
            status,
        });

        console.log(`✅ Sukses mengirim status ke IoT: ${response.data}`);
    } catch (error) {
        console.error(`❌ Gagal mengirim status ke IoT:`, error.message);
    }

    // Simpan perubahan status ke database
    await ScheduleModel.updateItem(id, { status });
}

// Cron job: Mengecek database setiap menit
cron.schedule("* * * * *", async () => {
    const currentTime = new Date().toTimeString().slice(0, 5); // Format HH:MM (misal: 08:00)
    const schedules = await ScheduleModel.getAllItems();

    schedules.forEach((schedule) => {
        if (schedule.jam === currentTime && !schedule.status) {
            console.log(`🔔 Menyalakan IoT untuk jadwal ID: ${schedule.id} pada jam ${schedule.jam}`);
            updateIoTStatus(schedule.id, true);

            // Mengembalikan status menjadi false setelah 5 menit
            setTimeout(() => {
                console.log(`🛑 Mematikan IoT untuk ID ${schedule.id} setelah 5 menit`);
                updateIoTStatus(schedule.id, false);
            }, 5 * 60 * 1000);
        }
    });
});

console.log("✅ Cron job untuk IoT berjalan...");
