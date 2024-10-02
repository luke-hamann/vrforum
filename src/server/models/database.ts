'use strict';

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

    static async get_topics_shallow(): Promise<Topic[]> {
        var connection: mysql.Connection =
            await mysql.createConnection(this.config);

        var [queryResult, _] = await connection.query(`
            SELECT id, name
            FROM topics
            ORDER BY LOWER(name)
        `);
        
        var topic_rows = queryResult as {
            id: number,
            name: string
        }[];

        var topics: Topic[] = topic_rows.map((row) => new Topic(
            row.id, row.name, true, [])
        );

        return topics;
    }

    static async get_topics(): Promise<Topic[]> {
        var connection: mysql.Connection;
        var queryResult: mysql.QueryResult;
        var all_posts: Post[];
        var all_replies: Reply[];
        var threads: Thread[];
        var topics: Topic[];

        connection =
            await mysql.createConnection(this.config);

        // Get all posts
        [queryResult, _] = await connection.query(`
            SELECT id, title, body, topic_id, date_time
            FROM posts
            ORDER BY date_time;
        `);

        var post_rows = queryResult as {
            id: number,
            title: string,
            body: string,
            topic_id: number,
            date_time: string
        }[];

        all_posts = post_rows.map(row => new Post(
            row.id,
            row.title,
            row.body,
            row.topic_id,
            new Date(Date.parse(row.date_time))
        ));

        // Get all replies
        var [queryResult, _] = await connection.query(`
            SELECT id, post_id, body, date_time
            FROM replies
            ORDER BY date_time;
        `);

        var reply_rows = queryResult as {
            id: number,
            post_id: number,
            body: string,
            date_time: string
        }[];

        all_replies = reply_rows.map(row => new Reply(
            row.id,
            row.post_id,
            row.body,
            new Date(Date.parse(row.date_time))
        ));

        // Generate threads based on posts and replies
        threads = all_posts.map((post) => new Thread(
            post,
            all_replies.filter((reply) => (reply.post_id == post.id))
        ));

        // Get all topics
        var [queryResult, _] = await connection.query(`
            SELECT id, name
            FROM topics
            ORDER BY id;
        `);

        var topic_rows = queryResult as {
            id: number,
            name: string
        }[];

        var topics: Topic[] = topic_rows.map((row) =>
            new Topic(row.id, row.name, false,
                threads.filter((thread) => (thread.post.topic_id == row.id))
            )
        );

        return topics;
    }

    static async add_post(post: Post) {
        const connection = await mysql.createConnection(this.config);
        await connection.query(`
            INSERT INTO posts (title, body, topic_id)
            VALUES (?, ?, ?);
        `, [post.title, post.body, post.topic_id]);
    }

    static async add_reply(reply: Reply): Promise<void> {
        const connection = await mysql.createConnection(this.config);
        await connection.query(`
            INSERT INTO replies (post_id, body)
            VALUES (?, ?);
        `, [reply.post_id, reply.body]);
    }
}
