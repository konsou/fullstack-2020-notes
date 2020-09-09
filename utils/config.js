const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

let DB_NAME = 'note-app'

if (process.env.NODE_ENV === 'test') {
    DB_NAME = 'note-app-test'
}

let MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@fullstack2020-bysw0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

module.exports = {
    PORT, MONGODB_URI
}

