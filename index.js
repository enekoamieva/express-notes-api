const { request } = require('express');
const express = require('express');

//Permitr el acceso a los datos de peticiones externas
const cors = require('cors');

const app = express();

//Cualquier origen va a funcionar en nuestra API
app.use(cors())

app.use(express.json());

let notes = [
    {
        'id': 1,
        'title': 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        'date': '2019-05-30T19:20:14.298Z'
    },
    {
        'id': 2,
        'title': 'qui est esse',
        'date': '2019-012-24T19:20:14.298Z'
    },
    {
        'id': 3,
        'title': 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
        'date': '2020-01-01T00:20:14.298Z'
    },
    {
        'id': 4,
        'title': 'eum et est occaecati',
        'date': '2029-05-26T19:20:14.298Z'
    },
];

/* const app = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/json' });
    res.end(JSON.stringify(notes));
}) */

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);

    const noteID = notes.find(note => note.id === id);

    if (noteID) {
        res.json(noteID);
    } else {
        res.status(404).end('No se ha encontrado la nota');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);

    notes = notes.filter(note => note.id !== id);

    if (notes) {
        res.status(204).end();
    } else {
        res.status(404).end('No se ha encontrado la nota');
    }
});

app.post('/api/notes', (req, res) => {
    const note = req.body;

    //Obtener la ultima ID de un post
    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);

    if (!note || !note.title) {
        return res.status(400).json({
            error: 'note.title is missing'
        });
    }

    const newNote = {
        id: maxId + 1,
        title: note.title,
        date: note.date
    };

    notes = [...notes, newNote];
    res.send(note);

});

//Error 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Error 404 ¡No encontrado!'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
