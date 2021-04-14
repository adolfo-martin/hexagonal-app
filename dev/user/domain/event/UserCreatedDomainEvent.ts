import { DomainEvent } from "../../../shared.kernel/event/DomainEvent";
import { User } from "../model/User";

export class UserCreatedDomainEvent extends DomainEvent {
    constructor(agregatedId: string, user: User) {
        const data = Object.entries(user)
        super('user_created_domain_event', agregatedId, data)
    }
}