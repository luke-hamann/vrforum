'use strict';

import express from 'express';
import pkg from 'nunjucks';
const { render } = pkg;
import Post from './models/post.js';
import Reply from './models/reply.js';
import Topic from './models/topic.js';
import Database from './models/database.js';
import nunjucks from 'nunjucks';
const app = express();
const port = 8001;

// Nunjucks configuration
// nunjucks.configure('../../views', {
//     autoescape: true,
//     express: app,       // For using Nunjucks with Express
//     throwOnUndefined: true,  // Enable better error reporting
//     noCache: true       // Disable caching for development
// });



// Read url-encoded post data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/lib', express.static('lib'));
app.use('/js', express.static('build/client'));
app.use('/src/client', express.static('src/client'));


// Handle internal server errors
function internal_server_error(response: express.Response): void {
    response.status(500).send('<h1>500</h1><p>Something went wrong.</p>');
}

// Get the topics page of the application
app.get('/', (request: express.Request, response: express.Response): void => {
    Database.get_topics()
    .then((topics: Topic[]) => {
        // Render the topics a-entity
        var content: string = render('./views/houses/topics.html', { topics, Math });

        // Wrap the a-entity with the index template if the user requests the full page
        if (request.get('Refresh') == undefined) {
            content = render('./views/houses/index.html', { content });
        }

        response.send(content);
    })
    .catch(() => internal_server_error(response));
});

// Post form data to the server
app.post('/', (request: express.Request, response: express.Response): void => {
    // If the user is attempting to submit a new post
    if (request.body.action == 'post') {
        var topic_id = Number(request.body.topic_id);
        var title = request.body.title;
        var body = request.body.body;
        var post = new Post(0, title, body, topic_id, null);
        Database.add_post(post)
        .then(() => Database.get_topic(topic_id))
        .then((topic) => {
            // Rerender and send the a-entity cooresponding to the relevant topic
            var content: string = render('./views/houses/topic.html', { topic, Math });
            response.send(content);
        })
        .catch(() => internal_server_error(response));

    // If the user is attempting to submit a new reply
    } else if (request.body.action == 'reply') {
        var post_id = Number(request.body.post_id);
        var body = request.body.body;
        var reply = new Reply(0, post_id, body, null);
        Database.add_reply(reply)
        .then(() => Database.get_thread(post_id))
        .then((thread) => {
            // Rerender and send the a-entity cooresponding to the relevant thread
            var content: string = render('./views/houses/thread.html', { thread, Math });
            response.send(content);
        })
        .catch(() => internal_server_error(response));
    }
});

// Get a topic page given its id
app.get('/topic/:topic_id/',
        (request: express.Request, response: express.Response): void => {
    var topic_id = Number(request.params.topic_id);
    Database.get_topic(topic_id)
    .then((topic: Topic) => {
        // Render the topic a-entity
        var content: string = render('./views/houses/topic.html', { topic , Math });

        // Wrap the topic a-entity with the index template if the user requests the full page
        if (request.get('Refresh') == undefined) {
            content = render('./views/houses/index.html', { content });
        }

        response.send(content);
    })
    .catch(() => internal_server_error(response));
});

// Get a form for submitting new posts to a given topic
app.get('/topic/:topic_id/post/',
        (request: express.Request, response: express.Response): void => {
    var topic_id = Number(request.params.topic_id);
    var form_content = render('./views/forms/new_post.html', { topic_id });
    response.send(form_content);
});

// Get a form for submitting new replies to a given post
app.get('/post/:post_id/reply/',
        (request: express.Request, response: express.Response): void => {
    var post_id = Number(request.params.post_id);
    var form_content = render('./views/forms/new_reply.html', { post_id });
    response.send(form_content);
});

// Notify the operator when the server is ready
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
