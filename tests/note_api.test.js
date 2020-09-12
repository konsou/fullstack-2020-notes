const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})

    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
})

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain('Browser can execute only Javascript')
})

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const allNotesAfter = await helper.notesInDb()
    expect(allNotesAfter).toHaveLength(helper.initialNotes.length + 1)

    const noteContents = allNotesAfter.map(n => n.content)

    expect(noteContents).toContain(newNote.content)
})

test('note without content is not added', async () => {
    const newNote = {
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const allNotesAfter = await helper.notesInDb()

    expect(allNotesAfter).toHaveLength(helper.initialNotes.length)
})

afterAll(() => {
    mongoose.connection.close()
})