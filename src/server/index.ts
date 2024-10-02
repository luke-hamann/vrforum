'use strict';

import express from 'express';
import pkg from 'nunjucks';
const { render } = pkg;
import Topic from './models/topic.js';
import Database from './models/database.js';

const app = express();
const port = 8001;

app.use('/lib', express.static('lib'));
app.use('/js', express.static('built/client'));

app.get('/', (_: express.Request, response: express.Response): void => {
    Database.get_topics_shallow()
    .then(
        (topics: Topic[]) => {
            var content: string = render('./views/houses/topics.html', { topics });
            var page: string = render('./views/houses/index.html', { content });
            response.send(page);
        },
        () => {
            response.status(500).send('<h1>500</h1><p>Something went wrong.</p>');
        }
);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
