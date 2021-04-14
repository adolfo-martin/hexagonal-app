import { QueryHandlerInterface } from "./QueryHandlerInterface";
import { QueryInterface } from "./QueryInterface";

export interface QueryBusInterface {
    register(commandClassName: string, handler: QueryHandlerInterface): void
    execute(command: QueryInterface): void
}