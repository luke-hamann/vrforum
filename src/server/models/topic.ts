'use strict';

import Thread from './thread.js';

export default class Topic {
    id: number;
    name: string;
    is_shallow: boolean; // If the Topic object does not contain its threads (to save memory)
    threads: Thread[];

    constructor(id: number, name: string, is_shallow: boolean, threads: Thread[]) {
        this.id = id;
        this.name = name;
        this.is_shallow = is_shallow;
        this.threads = threads;
    }

    get_longest_thread_length(): number {
        if (this.is_shallow) return -1;

        var lengths = this.threads.map((thread) => thread.get_length());
        return Math.max(...lengths);
    }
}
