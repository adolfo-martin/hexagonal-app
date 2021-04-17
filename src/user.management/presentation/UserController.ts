import { CommandBusInterface } from "../../shared.kernel/command/CommandBusInterface"
import { QueryBusInterface } from "../../shared.kernel/query/QueryBusInterface"
import { TokenSessionUtility } from "../../shared.kernel/utilities/TokenSessionUtility"
import { UuidGenerator } from "../../shared.kernel/utilities/UuidGenerator"
import { CreateUserCommand } from "../domain/command/CreateUserCommand"
import { OpenUserSessionCommand } from "../domain/command/OpenUserSessionCommand"
import { GetAllUsersQuery } from "../domain/query/GetAllUsersQuery"
import { GetUserByIdQuery } from "../domain/query/GetUserByIdQuery"

export class UserController {

    constructor(
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface,
    ) { }


    public getAllUsers(
        successCallback: Function,
        failCallback: Function,
        token: string,
        remoteAddress: string,
    ): void {
        if (!TokenSessionUtility.isValidToken(token, remoteAddress)) {
            failCallback('Token is not valid. User must validate again.')
            return
        }

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
        successCallback: Function,
        failCallback: Function
    ): void {
        const id: string = UuidGenerator.generate()

        const command = new CreateUserCommand(id, login, password)
        command.setSuccessCallback(successCallback)
        command.setFailCallback(failCallback)
        this._commandBus.execute(command)
    }


    public openUserSession(
        login: string,
        password: string,
        remoteAddress: string,
        successCallback: Function,
        failCallback: Function
    ) {
        const token = TokenSessionUtility.generateToken(login, remoteAddress)

        const command = new OpenUserSessionCommand(login, password, token)
        command.setSuccessCallback(successCallback)
        command.setFailCallback(failCallback)
        this._commandBus.execute(command)
    }
}