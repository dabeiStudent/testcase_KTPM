const mongoose = require('mongoose');
const uri = process.env.mongodb;

const connect2DB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri);
        // console.log("Đã kết nối database");
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connect2DB;

