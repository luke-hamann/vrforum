import express from 'express';
import pkg from 'nunjucks';
const render_template = pkg.render;
import Post from './models/post.js';
import Reply from './models/reply.js';
import Database from './models/database.js';

const app = express();
const port = 8001;

app.use(express.static('static'));
app.use(express.json());

app.get('/', async (request, response) => {
    var topics = await Database.get_topics();
    var content = render_template('./views/stripmall/index.html', {topics});
    response.send(content);
});

app.post('/', async (request, response) => {
    var action = request.body.action;
    if (action == 'post') {
        var topic_id = request.body.topic_id;
        var title = request.body.title;
        var body = request.body.body;
        var post = new Post(1, title, body, topic_id);
        Database.add_post(post);
    } else if (action == 'reply') {
        var post_id = request.body.post_id;
        var body = request.body.body;
        var reply = new Reply(1, post_id, body);
        Database.add_reply(reply);
    }

    var topics = await Database.get_topics();
    var content = render_template('./views/stripmall/stripmall.html', {topics});
    response.send(content);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
