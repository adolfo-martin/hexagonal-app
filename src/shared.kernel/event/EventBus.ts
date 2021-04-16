import { EventEmitter } from 'events'

export class EventBus extends EventEmitter {
    private static _eventBus: EventEmitter

    private constructor() {
        super()
    }

    public static eventBusFactory() {
        if (!EventBus._eventBus) {
            EventBus._eventBus = new EventEmitter()
        }

        return EventBus._eventBus
    }
}