import { CommandBusInterface } from "../../shared.kernel/command/CommandBusInterface"
import { QueryBusInterface } from "../../shared.kernel/query/QueryBusInterface"
import { CreateUserCommand } from "../domain/command/CreateUserCommand"
import { GetAllUsersQuery } from "../domain/query/GetAllUsersQuery"
import { GetUserByIdQuery } from "../domain/query/GetUserByIdQuery"

export class UserController {
    constructor(
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface,
    ) { }

    public getAllUsers(successCallback: Function, failCallback: Function) {
        const query = new GetAllUsersQuery()
        query.setSuccessCallback(successCallback)
        query.setFailCallback(failCallback)
        this._queryBus.execute(query)
    }

    public getUserById(id: string, successCallback: Function, failCallback: Function) {
        const query = new GetUserByIdQuery(id)
        query.setSuccessCallback(successCallback)
        query.setFailCallback(failCallback)
        this._queryBus.execute(query)
    }

    public createUser(id: string, login: string, password: string, successCallback: Function, failCallback: Function) {
        const command = new CreateUserCommand(id, login, password)
        command.setSuccessCallback(successCallback)
        command.setFailCallback(failCallback)
        this._commandBus.execute(command)
    }
}