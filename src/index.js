const express = require('express');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

// Suhu
// PH
// turbidity
// tds

const router = require('./routes/route');
app.use('/api', router);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);