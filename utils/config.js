if (process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config()
}

let PORT = process.env.PORT
let DB_USERNAME = process.env.DB_USERNAME
let DB_PASSWORD = process.env.DB_PASSWORD

module.exports = {
    PORT, DB_USERNAME, DB_PASSWORD
}

