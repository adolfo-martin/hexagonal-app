import { QueryBusError } from "../../../shared.kernel/query/QueryBusError"
import { QueryBusInterface } from "../../../shared.kernel/query/QueryBusInterface"
import { QueryHandlerInterface } from "../../../shared.kernel/query/QueryHandlerInterface"
import { QueryInterface } from "../../../shared.kernel/query/QueryInterface"


export class SynchronousQueryBus implements QueryBusInterface {
    private _handlers = new Map<string, QueryHandlerInterface>()

    register(commandClassName: string, handler: QueryHandlerInterface): void {
        this._handlers.set(commandClassName, handler)
    }

    execute(command: QueryInterface): void {
        if (!command.className) {
            throw new QueryBusError('Query class name is needed')
        }

        if (!this._handlers.has(command.className)) {
            throw new QueryBusError(`Query ${command.className} is not registered`)
        }

        // @ts-ignore: Unreachable code error
        const handler: QueryHandlerInterface = this._handlers.get(command.className)
        handler.handle(command)
    }

}