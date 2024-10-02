'use strict';

import Post from './post.js';
import Reply from './reply.js';
import Thread from './thread.js';
import Topic from './topic.js';

export default class DatabaseDummy {
    static get_topics() {
        return [
            new Topic(1, 'Programming', [
                new Thread(
                    new Post(1, 'First Post', 'Hello\nWorld', 1, new Date(Date.UTC(2024, 9, 27))),
                    [
                        new Reply(1, 1, 'wow\nza', new Date(Date.UTC(2024, 9, 28))),
                        new Reply(2, 1, 'nice\ncool', new Date(Date.UTC(2024, 9, 29)))
                    ]
                ),
                new Thread(
                    new Post(2, 'Second Post', 'Goodbye\nWorld', 2, new Date(Date.UTC(2024, 9, 28))),
                    [
                        new Reply(3, 2, 'body\nbody',new Date(Date.UTC(2024, 9, 29)))
                    ]
                ),
                new Thread(
                    new Post(3, 'Third Post', 'What you doing?', 3,new Date(Date.UTC(2024, 9, 29))),
                    [
                        new Reply(4, 3, 'aa\nbb',new Date(Date.UTC(2024, 9, 30))),
                        new Reply(5, 3, 'cc\ndd',new Date(Date.UTC(2024, 10, 1))),
                        new Reply(6, 3, 'ee\nff',new Date(Date.UTC(2024, 10, 2)))
                    ]
                )
            ])
        ];
    }
}
