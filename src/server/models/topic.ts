'use strict';

import Thread from './thread.js';

export default class Topic {
    id: number;
    name: string;
    threads: Thread[];

    constructor(id: number, name: string, threads: Thread[]) {
        this.id = id;
        this.name = name;
        this.threads = threads;
    }

    get_longest_thread_length(): number {
        var lengths = this.threads.map((thread) => thread.get_length());
        return Math.max(...lengths);
    }
}
