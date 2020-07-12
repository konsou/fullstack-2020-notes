if (process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config()
}

const express = require('express')
const cors = require('cors')
const app = express()

const Note = require('./models/note')
// const ObjectId = require('mongodb').ObjectID


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => response.json(notes))
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    console.log('GET', id)
    Note.findById(id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    console.log(note)

    note.save()
        .then(savedNote => savedNote.toJSON())
        .then(savedAndFormattedNote => response.json(savedAndFormattedNote))
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})