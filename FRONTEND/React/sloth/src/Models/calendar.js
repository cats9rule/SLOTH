import { Event } from "./event.js"

export class Calendar {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.events = [];
    }
}