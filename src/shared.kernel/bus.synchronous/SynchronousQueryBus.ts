import { QueryBusError } from "../query/QueryBusError"
import { QueryBusInterface } from "../query/QueryBusInterface"
import { QueryHandlerInterface } from "../query/QueryHandlerInterface"
import { QueryInterface } from "../query/QueryInterface"

export class SynchronousQueryBus implements QueryBusInterface {
    private _handlers = new Map<string, QueryHandlerInterface>()

    register(commandClassName: string, handler: QueryHandlerInterface): void {
        this._handlers.set(commandClassName, handler)
    }

    async execute(command: QueryInterface): Promise<void> {
        if (!command.className) {
            throw new QueryBusError('Query class name is needed')
        }

        if (!this._handlers.has(command.className)) {
            throw new QueryBusError(`Query ${command.className} is not registered`)
        }

        // @ts-ignore: Unreachable code error
        const handler: QueryHandlerInterface = this._handlers.get(command.className)
        await handler.handle(command)

    }
}