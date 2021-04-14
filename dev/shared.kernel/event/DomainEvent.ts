import { TimeStampGenerator } from "../utilities/TimeStampGenerator";
import { DomainEventInterface } from "./DomainEventInterface";

export class DomainEvent implements DomainEventInterface {
    public readonly timeStamp: number

    public constructor(
        public readonly name: string,
        public readonly agregateId: string,
        public readonly data: [string, any][]
    ) {
        this.timeStamp = TimeStampGenerator.generate()
    }
}