
const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.ENV_HOST,
    user: process.env.ENV_USER,
    password: process.env.ENV_PASSWORD,
    database: process.env.ENV_DATABASE,
})

db.connect(err => {
    if (err) {
        console.log(err)
    } else {
        console.log('Database is connected to :', process.env.ENV_DATABASE)
    }
})

module.exports = { db }