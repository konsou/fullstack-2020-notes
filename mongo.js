const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')

    dotenv.config()
    console.log('env test: ', process.env.TEST)
}

if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack-user:${password}@fullstack2020-bysw0.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

Note.find({ important: false }).then(result => {
    result.forEach(note => console.log(note))
    mongoose.connection.close()
})
/*
const note = new Note({
    content: 'This is the third test note',
    date: new Date(),
    important: true
})

note.save().then(response => {
    console.log('note saved:')
    console.log(response)
    mongoose.connection.close()
})
*/
