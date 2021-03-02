//Para tomar  las variables de entorno creadas en el fichero .env
require('dotenv').config();

const express = require('express');

//Importamos la conexión al servidor de MongoDB
require('./mongo.js');

//Permitr el acceso a los datos de peticiones externas
const cors = require('cors');
//Inicializar servidor
const app = express();
//Cualquier origen va a funcionar en nuestra API
app.use(cors())
//Permitir el uso de Json al servidor
app.use(express.json());
//Ruta para poder servir estáticos en nuestro servidor
app.use('/images', express.static('images'));

//Importar el modelo de Notas para Mongo
const NoteModel = require('./models/Note.js');


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
    NoteModel.find({}).then(note => {
        res.json(note);
    })
});

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;

    //Comprobación de la nota a consultar
    NoteModel.findById(id)
        .then(note => {
            if (note) {
                return res.json(note);
            } else {
                res.status(404).end('No se ha encontrado la nota');
            }
        })
        .catch(err => next(err));
});

app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;

    NoteModel.findByIdAndRemove(id)
        .then(note => {
            if (note) {
                return res.status(204).end('Nota eliminada');
            } else {
                res.status(404).end('No se ha encontrado la nota');
            }

        })
        .catch(err => next(err));
});

app.put('/api/notes/:id', (req, res, next) => {
    const note = req.body;
    const id = req.params.id;

    if (!note || !note.title || !note.content) {
        return res.status(400).json({
            error: 'note.title or note.content is missing'
        });
    }

    const updateNote = {
        ...note,
        title: note.title,
        content: note.content,
        important: note.important,
    }

    NoteModel.findByIdAndUpdate(id, updateNote, { new: true })
        .then(result => {
            return res.json(result);
        })
        .catch(err => next(err));
});

app.post('/api/notes', (req, res) => {
    const note = req.body;

    //Obtener la ultima ID de un post
    //const ids = notes.map(note => note.id);
    //const maxId = Math.max(...ids);

    if (!note || !note.title) {
        return res.status(400).json({
            error: 'note.title is missing'
        });
    }

    //Obtenemos los datos que llegan al servidor y los guardamos creando una instancia del modelo
    const newNote = new NoteModel({
        title: note.title,
        content: note.content,
        date: new Date(),
        important: note.important
    });

    //Guardamos la información en MongoDB
    newNote.save().then(savedNote => {
        res.json(savedNote);
    });

});

//Middleware para capturar los errores. All poner como primer parametro ERROR un CATCH con error buscará este middleware
app.use((error, req, res, next) => {
    console.error(error);
    //console.log(error.name);
    if (error.name === 'CastError') {
        return res.status(400).end('Petición incorrecta!! La id usada no está bien');
    } else {
        return res.status(500).end();
    }
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
