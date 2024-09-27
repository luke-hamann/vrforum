import Post from './post.js';
import Reply from './reply.js';
import Thread from './thread.js';
import Topic from './topic.js';

export default class DatabaseDummy {
    static get_topics() {
        return [
            new Topic(1, 'Programming', [
                new Thread(
                    new Post(1, 'First Post', 'Hello\nWorld', 1, Date.UTC('2024-09-27')),
                    [
                        new Reply(1, 1, 'wow\nza', Date.UTC('2024-09-28')),
                        new Reply(2, 1, 'nice\ncool', Date.UTC('2024-09-29'))
                    ]
                ),
                new Thread(
                    new Post(2, 'Second Post', 'Goodbye\nWorld', 2, Date.UTC('2024-09-28')),
                    [
                        new Reply(3, 2, 'body\nbody', Date.UTC('2024-09-29'))
                    ]
                ),
                new Thread(
                    new Post(3, 'Third Post', 'What you doing?', 3, Date.UTC('2024-09-29')),
                    [
                        new Reply(4, 3, 'aa\nbb', Date.UTC('2024-09-30')),
                        new Reply(5, 3, 'cc\ndd', Date.UTC('2024-10-01')),
                        new Reply(6, 3, 'ee\nff', Date.UTC('2024-10-02'))
                    ]
                )
            ])
        ]
    }
}
