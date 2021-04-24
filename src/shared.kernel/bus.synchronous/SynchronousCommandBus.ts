import { CommandBusError } from "../command/CommandBusError"
import { CommandBusInterface } from "../command/CommandBusInterface"
import { CommandHandlerInterface } from "../command/CommandHandlerInterface"
import { CommandInterface } from "../command/CommandInterface"


export class SynchronousCommmandBus implements CommandBusInterface {
    private _handlers = new Map<string, CommandHandlerInterface>()

    register(commandClassName: string, handler: CommandHandlerInterface): void {
        this._handlers.set(commandClassName, handler)
    }

    async execute(command: CommandInterface): Promise<void> {
        if (!command.className) {
            throw new CommandBusError('Command class name is needed')
        }

        if (!this._handlers.has(command.className)) {
            throw new CommandBusError(`Command ${command.className} is not registered`)
        }

        // @ts-ignore: Unreachable code error
        const handler: CommandHandlerInterface = this._handlers.get(command.className)
        return handler.handle(command)
    }
}