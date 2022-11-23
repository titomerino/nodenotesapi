const express = require('express');
const app = express();
const db = require('./db');
var cors = require('cors');

app.use(express.json());
app.use(cors({origin: "*" }));

/**
 * Busca el id más alto y le suma una unidad.
 * @returns Identificador más alto más una unidad más
 */
function calculteId () {
    let maxId = 0;
    for (var item of db.notes) {
        if (maxId < parseInt(item.id)) maxId = parseInt(item.id);
    }

    return maxId + 1;
}

/**
 * Valida que la información ha insertar no sea vacío.
 * @param {id: 1, name: "", description: "", image: ""} data nota
 * @returns False si hay campos vacíos y true si todos están llenos.
 */
function validateData(data) {
    if (data.name === '') return false;
    if (data.description === '') return false;
    if (data.image === '') return false;

    return true;
}

/** Raiz */
app.get('/', (request, response) => {
    response.send('API Notes lista.');
});

/** Listado de notas */
app.get('/api/notes', (request, response) => {
    response.send(db.notes)
});

/** Nota específica */
app.get('/api/notes/:id', (request, response) => {
    const note = db.notes.find(c => c.id === parseInt(request.params.id));

    if (!note) return response.status(404).send({message: 'Nota no encontrada.'});
    else response.send(note);
});

/** Inserta una nota nueva */
app.post('/api/notes', (request, response) => {
    const note = {
        id: calculteId(),
        name: request.body.name,
        description: request.body.description,
        image: request.body.image
    }

    if (!validateData(note)) response.status(404).send({message: 'Campos vacíos'});

    db.notes.push(note);
    response.send({message: 'Nota insertada.'});
});

/** Elimina una nota específica. */
app.delete('/api/notes/:id', (request, response) => {
    const note = db.notes.find(c => c.id === parseInt(request.params.id));
    if (!note) return response.status(404).send({message: 'La nota no existe.'});

    const index = db.notes.indexOf(note);
    db.notes.splice(index, 1);
    response.send({message: 'Nota eliminada.'});
});

/** Actualiza una nota */
app.put('/api/notes', (request, response) => {
    const note = db.notes.find(c => c.id === parseInt(request.body.id));
    if (!note) return response.status(404).send({message: 'La nota no existe.'});

    for (var item of db.notes) {
        if (item.id == note.id) {
            item.name = request.body.name;
            item.image = request.body.image;
            item.description = request.body.description;
            break;
        }
    }

    response.send({message: "Nota editada."});

})

const port = process.env.port || 8081;
app.listen(port, () => console.log(`Escuchando en el puerto ${port} ...`));

