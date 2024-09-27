import mysql from 'mysql2/promise';
import express from 'express';
import { render_post } from './views/post.js';
import { wrap } from './views/wrap.js';

const app = express();
const port = 8001;

app.use(express.static('static'));

app.get('/', async (request, response) => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'vrforum',
            password: 'password',
            database: 'vrforum'
        });

        const [results, fields] = await connection.execute(
            'SELECT title, body, date_time FROM posts WHERE id = 1;'
        );

        response.send(wrap(render_post(results[0])));
    } catch (error) {
        response.status(500).send('Internal server error');
        return;
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
