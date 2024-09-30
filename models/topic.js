import Thread from './thread.js';

export default class Topic {
    /**
     * @param {number} id 
     * @param {string} name 
     * @param {Thread[]} threads 
     */
    constructor(id, name, threads) {
        this.id = id;
        this.name = name;
        this.threads = threads;
    }

    get_longest_thread_length() {
        var lengths = this.threads.map((thread) => thread.get_length());
        return Math.max(...lengths);
    }
}
