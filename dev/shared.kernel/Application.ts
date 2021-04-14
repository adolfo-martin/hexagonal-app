import { UserRepositoryInterface } from "../user/domain/repository/UserRepositoryInterface"
import { CommandBusInterface } from "./command/CommandBusInterface"
import { DomainEventDispatcher } from "./event/DomainEventDispatcher"
import { QueryBusInterface } from "./query/QueryBusInterface"


export class Application {
    private static _commandBus: CommandBusInterface
    private static _queryBus: QueryBusInterface
    private static _domainEventDispatcher: DomainEventDispatcher
    private static _userRepository: UserRepositoryInterface

    public static setup(
        commandBus: CommandBusInterface,
        queryBus: QueryBusInterface,
        domainEventDispatcher: DomainEventDispatcher,
        userRepository: UserRepositoryInterface,
    ) {
        Application._commandBus = commandBus
        Application._queryBus = queryBus
        Application._domainEventDispatcher = domainEventDispatcher
        Application._userRepository = userRepository
    }

    public static run(callback: Function): void {
        callback()
    }
}
