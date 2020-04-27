class Queue {
    constructor(limit) {
        this.items = [];
        this.limit = limit;
    }
    enqueue(element) {
        this.items.push(element);

        if (this.items.length > this.limit) {
            this.dequeue();
        }
    }

    dequeue() {
        return this.items.shift();
    }

    front() {
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    get size() {
        return this.items.length;
    }

    print() {
        console.log(this.items.toString());
    }
}
