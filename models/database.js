import mysql from 'mysql2/promise';
import Post from './post.js';
import Reply from './reply.js';
import Thread from './thread.js';
import Topic from './topic.js';

export default class Database {
    static config = {
        host: 'localhost',
        user: 'vrforum',
        password: 'password',
        database: 'vrforum'
    };

    /**
     * @return {Topic[]}
     */
    static async get_topics() {
        const connection = await mysql.createConnection(this.config);

        // Get all posts
        var [rows, _] = await connection.query(`
            SELECT id, title, body, topic_id, date_time
            FROM posts
            ORDER BY date_time;
        `);

        const all_posts = rows.map((row) =>
            new Post(row.id, row.title, row.body, row.topic_id,
                new Date(Date.parse(row.date_time)))
        );

        // Get all replies
        var [rows, _] = await connection.query(`
            SELECT id, post_id, body, date_time
            FROM replies
            ORDER BY date_time;
        `);
        const all_replies = rows.map((row) =>
            new Reply(row.id, row.post_id, row.body,
                new Date(Date.parse(row.date_time)))
        );

        // Generate threads based on posts and replies
        const threads = all_posts.map((post) => new Thread(
            post,
            all_replies.filter((reply) => (reply.post_id == post.id))
        ));

        // Get all topics
        var [rows, _] = await connection.query(`
            SELECT id, name
            FROM topics
            ORDER BY id;
        `);
        const topics = rows.map((row) => new Topic(
            row.id,
            row.name,
            threads.filter((thread) => (thread.post.topic_id == row.id))
        ));

        return topics;
    }

    /**
     * @param {Post} post
     */
    static async add_post(post) {
        const connection = await mysql.createConnection(this.config);
        await connection.query(`
            INSERT INTO posts (title, body, topic_id)
            VALUES (?, ?, ?);
        `, [post.title, post.body, post.topic_id]);
    }

    /**
     * @param {Reply} reply 
     */
    static async add_reply(reply) {
        const connection = await mysql.createConnection(this.config);
        await connection.query(`
            INSERT INTO replies (post_id, body)
            VALUES (?, ?);
        `, [reply.post_id, reply.body]);
    }
}
