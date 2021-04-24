import { CommandHandlerInterface } from "./CommandHandlerInterface";
import { CommandInterface } from "./CommandInterface";

export interface CommandBusInterface {
    register(commandClassName: string, handler: CommandHandlerInterface): void
    execute(command: CommandInterface): Promise<void>
}