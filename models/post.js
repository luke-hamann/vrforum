export default class Post {
    /**
     * 
     * @param {number} id 
     * @param {string} title 
     * @param {string} body 
     * @param {number} topic_id 
     * @param {Date} date_time 
     */
    constructor(id, title, body, topic_id, date_time) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.topic_id = topic_id;
        this.date_time = date_time;
    }
}
