import { DomainEvent } from "../../../shared.kernel/event/DomainEvent";
import { User } from "../model/User";

export class UserValidatedDomainEvent extends DomainEvent {
    constructor(agregatedId: string, user: User, userToken: string, stampTime: number) {
        const data = JSON.stringify({ ...user, userToken, stampTime })
        super('user_created_domain_event', agregatedId, data)
    }
}