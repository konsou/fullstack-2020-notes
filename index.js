if (process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config()
}

const express = require('express')
const cors = require('cors')
const app = express()

const Note = require('./models/note')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let notes = [ 
    { 
        id: 1, 
        content: "HTML is easy - refresh test", 
        date: "2020-01-10T17:30:31.098Z", 
        important: true 
    }, 
    { 
        id: 2, 
        content: "Browser can execute only Javascript", 
        date: "2020-01-10T18:39:34.091Z", 
        important: false 
    }, 
    { 
        id: 3, 
        content: "GET and POST are the most important methods of HTTP protocol", 
        date: "2020-01-10T19:20:14.298Z", 
        important: true 
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => response.json(notes))
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    Note.findById(id).then(note => {
        response.json(note)
    })
})


app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'Missing content'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    console.log(note)

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})