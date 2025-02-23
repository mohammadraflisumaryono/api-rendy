const express = require('express');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const port = 3000;


// cron-job
require("./utils/cron-schedule");
// dashboard pages dashboard.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/dashboard.html');
});

app.get('/jadwal', (req, res) => {
    res.sendFile(__dirname + '/public/pages/form-schedule.html');
});



const router = require('./routes/route');
app.use('/api', router);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);






