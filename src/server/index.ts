'use strict';

import express from 'express';
import pkg from 'nunjucks';
const { render } = pkg;
import Topic from './models/topic.js';
import Database from './models/database.js';
import DatabaseDummy from './models/databasedummy.js';

const app = express();
const port = 8001;

app.use('/lib', express.static('lib'));
app.use('/js', express.static('build/client'));
app.use('/src/client', express.static('src/client'));

function internal_server_error(response: express.Response): void {
    response.status(500).send('<h1>500</h1><p>Something went wrong.</p>');
}

app.get('/', (_: express.Request, response: express.Response): void => {
    Database.get_topics_shallow()
    .then(
        (topics: Topic[]) => {
            var content: string = render('./views/houses/topics.html', { topics });
            var page: string = render('./views/houses/index.html', { content });
            response.send(page);
        },
        () => {
            internal_server_error(response);
        }
);
});

app.get('/topic/:topic_id/',
        (request: express.Request, response: express.Response): void => {
    var topic_id = Number(request.params.topic_id);
    Database.get_topic(topic_id)
    .then(
        (topic: Topic) => {
            var content: string = render('./views/houses/topic.html', { topic , Math });
            var page: string = render('./views/houses/index.html', { content });
            response.send(page);
        },
        () => {
            internal_server_error(response);
        }
    );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
