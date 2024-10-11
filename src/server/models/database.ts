'use strict';

import mysql from 'mysql2/promise';
import Post from './post.js';
import Reply from './reply.js';
import Thread from './thread.js';
import Topic from './topic.js';

export default class Database {
    // Configure the database connection
    static config = {
        host: 'localhost',
        user: 'vrforum',
        password: 'password',
        database: 'vrforum'
    };

    // Convert result rows to an array of Topic objects
    static _query_result_to_topics(query_result: mysql.QueryResult): Topic[] {
        var rows = query_result as {
            id: number,
            name: string
        }[];

        return rows.map((row) => new Topic(row.id, row.name, true, []));
    }

    // Convert result rows to an array of Post objects
    static _query_result_to_posts(query_result: mysql.QueryResult): Post[] {
        var rows = query_result as {
            id: number,
            title: string,
            body: string,
            topic_id: number,
            date_time: string
        }[];

        return rows.map((row) => new Post(row.id, row.title, row.body,
            row.topic_id, new Date(Date.parse(row.date_time))));
    }

    // Convert result rows to an array of Reply objects
    static _query_result_to_replies(query_result: mysql.QueryResult): Reply[] {
        var rows = query_result as {
            id: number,
            post_id: number,
            body: string,
            date_time: string
        }[];

        return rows.map((row) => new Reply(row.id, row.post_id, row.body,
            new Date(Date.parse(row.date_time))));
    }

    // Get an array of all Topics
    static async get_topics(): Promise<Topic[]> {
        var connection: mysql.Connection =
            await mysql.createConnection(this.config);

        var [query_result, _] = await connection.query(`
            SELECT id, name
            FROM topics
            ORDER BY LOWER(name);
        `);
        
        return this._query_result_to_topics(query_result);
    }

    // Get a Topic given its id, including all its threads (posts and replies)
    static async get_topic(topic_id: number): Promise<Topic> {
        var connection: mysql.Connection =
            await mysql.createConnection(this.config);

        // Get topic
        var [query_result, _] = await connection.query(`
            SELECT id, name
            FROM topics
            WHERE id = ?;
        `, [topic_id]);

        var topic = this._query_result_to_topics(query_result)[0];

        // Get posts
        var [query_result, _] = await connection.query(`
            SELECT id, title, body, topic_id, date_time
            FROM posts
            WHERE topic_id = ?
            ORDER BY date_time;
        `, [topic_id]);

        var posts = this._query_result_to_posts(query_result);

        // Get replies
        var [query_result, _] = await connection.query(`
            SELECT r.id, r.post_id, r.body, r.date_time
            FROM posts p
                JOIN replies r ON (p.id = r.post_id)
            WHERE p.topic_id = ?
            ORDER by r.post_id, r.date_time;
        `, [topic_id]);

        var replies = this._query_result_to_replies(query_result);

        // Build Threads
        var threads = posts.map((post) => new Thread(post,
            replies.filter((reply) => reply.post_id == post.id)));

        topic.threads = threads;

        return topic;
    }

    // Get a Thread based on its post id, including its post and all replies
    static async get_thread(post_id: number): Promise<Thread> {
        const connection: mysql.Connection =
            await mysql.createConnection(this.config);

        // Get post
        var [query_result, _] = await connection.query(`
            SELECT id, title, body, topic_id, date_time
            FROM posts
            WHERE id = ?;
        `, [post_id]);

        var post = this._query_result_to_posts(query_result)[0];

        // Get replies
        var [query_result, _] = await connection.query(`
            SELECT id, post_id, body, date_time
            FROM replies
            WHERE post_id = ?;
        `, [post_id]);

        var replies = this._query_result_to_replies(query_result);

        return new Thread(post, replies);
    }

    // Add a post to the database
    static async add_post(post: Post): Promise<void> {
        const connection: mysql.Connection =
            await mysql.createConnection(this.config);
        await connection.query(`
            INSERT INTO posts (title, body, topic_id)
            VALUES (?, ?, ?);
        `, [post.title, post.body, post.topic_id]);
    }

    // Add a reply to the database
    static async add_reply(reply: Reply): Promise<void> {
        const connection: mysql.Connection =
            await mysql.createConnection(this.config);
        await connection.query(`
            INSERT INTO replies (post_id, body)
            VALUES (?, ?);
        `, [reply.post_id, reply.body]);
    }
}
