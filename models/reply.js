export default class Reply {
    /**
     * @param {number} id 
     * @param {number} post_id 
     * @param {string} body 
     * @param {Date} date_time 
     */
    constructor(id, post_id, body, date_time) {
        this.id = id;
        this.post_id = post_id;
        this.body = body;
        this.date_time = date_time;
    }
}
