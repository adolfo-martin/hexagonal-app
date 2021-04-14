import { CommandInterface } from "./CommandInterface";

export interface CommandHandlerInterface {
    handle(command: CommandInterface): void
}