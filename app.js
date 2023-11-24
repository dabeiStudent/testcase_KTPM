require('dotenv').config();
const express = require('express');
const app = express();
const connect2DB = require('./connect2DB');
const restAPI = require('./routes/restAPI');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
    // console.log("Server đang chạy trên port 3000");
})
connect2DB();
restAPI(app);

module.exports = app;