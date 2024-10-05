'use strict';

import express from 'express';
import pkg from 'nunjucks';
const { render } = pkg;
import Post from './models/post.js';
import Reply from './models/reply.js';
import Topic from './models/topic.js';
import Database from './models/database.js';

const app = express();
const port = 8001;

// Reading url-encoded post data
app.use(express.urlencoded({extended:true}));

// Static files
app.use('/lib', express.static('lib'));
app.use('/js', express.static('build/client'));
app.use('/src/client', express.static('src/client'));

function internal_server_error(response: express.Response): void {
    response.status(500).send('<h1>500</h1><p>Something went wrong.</p>');
}

app.get('/', (request: express.Request, response: express.Response): void => {
    Database.get_topics()
    .then(
        (topics: Topic[]) => {
            var content: string = render('./views/houses/topics.html', { topics, Math });

            if (request.get('Refresh') == undefined) {
                content = render('./views/houses/index.html', { content });
            }

            response.send(content);
        },
        () => {
            internal_server_error(response);
        }
);
});

app.post('/', (request: express.Request, response: express.Response): void => {
    if (request.body.action == 'post') {
        var topic_id = Number(request.body.topic_id);
        var title = request.body.title;
        var body = request.body.body;
        var post = new Post(0, title, body, topic_id, null);
        Database.add_post(post)
        .then(() => Database.get_topic(topic_id))
        .then((topic) => {
            response.send(render('./views/houses/topic.html', { topic, Math }))
        });
    } else if (request.body.action == 'reply') {
        var post_id = Number(request.body.post_id);
        var body = request.body.body;
        var reply = new Reply(0, post_id, body, null);
        Database.add_reply(reply)
        .then(() => Database.get_thread(post_id))
        .then((thread) => {
            response.send(render('./views/houses/thread.html', { thread, Math }));
        });
    }
});

app.get('/topic/:topic_id/',
        (request: express.Request, response: express.Response): void => {
    var topic_id = Number(request.params.topic_id);
    Database.get_topic(topic_id)
    .then(
        (topic: Topic) => {
            var content: string = render('./views/houses/topic.html', { topic , Math });

            if (request.get('Refresh') == undefined) {
                content = render('./views/houses/index.html', { content });
            }

            response.send(content);
        },
        () => {
            internal_server_error(response);
        }
    );
});

app.get('/topic/:topic_id/post/',
        (request: express.Request, response: express.Response): void => {
    var topic_id = Number(request.params.topic_id);
    var form_content = render('./views/forms/post.html', { topic_id });
    response.send(form_content)
});

app.get('/post/:post_id/reply/',
        (request: express.Request, response: express.Response): void => {
    var post_id = Number(request.params.post_id);
    var form_content = render('./views/forms/reply.html', { post_id });
    response.send(form_content);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
