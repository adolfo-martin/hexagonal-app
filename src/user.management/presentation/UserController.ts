import { CommandBusInterface } from '../../shared.kernel/command/CommandBusInterface'
import { QueryBusInterface } from '../../shared.kernel/query/QueryBusInterface'
import { UuidGenerator } from '../../shared.kernel/utilities/UuidGenerator'
import { CreateUserCommand } from '../domain/command/CreateUserCommand'
import { OpenAdministratorSessionCommand } from '../domain/command/OpenAdministratorSessionCommand'
import { OpenUserSessionCommand } from '../domain/command/OpenUserSessionCommand'
import { GetAllUsersQuery } from '../domain/query/GetAllUsersQuery'
import { GetUserByIdQuery } from '../domain/query/GetUserByIdQuery'

export class UserController {
    constructor(
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface
    ) {}

    public getAllUsers(
        successCallback: Function,
        failCallback: Function
    ): void {
        const query = new GetAllUsersQuery()
        query.setSuccessCallback(successCallback)
        query.setFailCallback(failCallback)
        this._queryBus.execute(query)
    }

    public getUserById(
        id: string,
        successCallback: Function,
        failCallback: Function
    ): void {
        const query = new GetUserByIdQuery(id)
        query.setSuccessCallback(successCallback)
        query.setFailCallback(failCallback)
        this._queryBus.execute(query)
    }

    public createUser(
        login: string,
        password: string,
        type: string,
        successCallback: Function,
        failCallback: Function
    ): void {
        const id: string = UuidGenerator.generate()

        const command = new CreateUserCommand(id, login, password, type)
        command.setSuccessCallback(successCallback)
        command.setFailCallback(failCallback)
        this._commandBus.execute(command)
    }

    public openUserSession(
        login: string,
        password: string,
        successCallback: Function,
        failCallback: Function
    ) {
        const command = new OpenUserSessionCommand(login, password)
        command.setSuccessCallback(successCallback)
        command.setFailCallback(failCallback)
        this._commandBus.execute(command)
    }

    public openAdministratorSession(
        login: string,
        password: string,
        successCallback: Function,
        failCallback: Function
    ) {
        const command = new OpenAdministratorSessionCommand(login, password)
        command.setSuccessCallback(successCallback)
        command.setFailCallback(failCallback)
        this._commandBus.execute(command)
    }
}
