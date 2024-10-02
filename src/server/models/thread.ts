'use strict';

import Post from './post.js';
import Reply from './reply.js';

export default class Thread {
    post: Post;
    replies: Reply[];
    
    constructor(post: Post, replies: Reply[]) {
        this.post = post;
        this.replies = replies;
    }

    get_length(): number {
        return 1 + this.replies.length;
    }
}
