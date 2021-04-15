import { CommandBusError } from "../../../shared.kernel/command/CommandBusError"
import { CommandBusInterface } from "../../../shared.kernel/command/CommandBusInterface"
import { CommandHandlerInterface } from "../../../shared.kernel/command/CommandHandlerInterface"
import { CommandInterface } from "../../../shared.kernel/command/CommandInterface"

export class SynchronousCommmandBus implements CommandBusInterface {
    private _handlers = new Map<string, CommandHandlerInterface>()

    register(commandClassName: string, handler: CommandHandlerInterface): void {
        this._handlers.set(commandClassName, handler)
    }

    execute(command: CommandInterface): void {
        if (!command.className) {
            throw new CommandBusError('Command class name is needed')
        }

        if (!this._handlers.has(command.className)) {
            throw new CommandBusError(`Command ${command.className} is not registered`)
        }

        // @ts-ignore: Unreachable code error
        const handler: CommandHandlerInterface = this._handlers.get(command.className)
        handler.handle(command)
    }

}