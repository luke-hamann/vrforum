'use strict';

export default class Post {
    id: number;
    title: string;
    body: string;
    topic_id: number;
    date_time: Date;
    
    constructor(id: number, title: string, body: string, topic_id: number, date_time: Date) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.topic_id = topic_id;
        this.date_time = date_time;
    }
}
