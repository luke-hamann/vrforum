import express from 'express';
import Database from './models/database.js';
import stripmall from './views/stripmall.js';

const app = express();
const port = 8001;

app.use(express.static('static'));

app.get('/', async (request, response) => {
    response.send(stripmall(Database.get_world()));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
