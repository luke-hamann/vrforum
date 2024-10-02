'use strict';

export default class Reply {
    id: number;
    post_id: number;
    body: string;
    date_time: Date;
    
    constructor(id: number, post_id: number, body: string, date_time: Date) {
        this.id = id;
        this.post_id = post_id;
        this.body = body;
        this.date_time = date_time;
    }
}
