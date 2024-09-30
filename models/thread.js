import Post from './post.js';
import Reply from './reply.js';

export default class Thread {
    /**
     * @param {Post} post
     * @param {Reply[]} replies
     */
    constructor(post, replies) {
        this.post = post;
        this.replies = replies;
    }

    /**
     * @return {number} The length of the thread
     */
    get_length() {
        return 1 + this.replies.length;
    }
}
