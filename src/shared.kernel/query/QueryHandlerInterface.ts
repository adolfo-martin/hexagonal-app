import { QueryInterface } from "./QueryInterface";

export interface QueryHandlerInterface {
    handle(command: QueryInterface): Promise<void>
}