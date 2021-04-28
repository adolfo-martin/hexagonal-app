import { QueryBusError } from "../../../shared.kernel/query/QueryBusError"
import { QueryHandlerInterface } from "../../../shared.kernel/query/QueryHandlerInterface"
import { QueryInterface } from "../../../shared.kernel/query/QueryInterface"
import { UserServiceInterface } from "../../domain/service/UserServiceInterface"
import { GetAllUsersQuery } from "../../domain/query/GetAllUsersQuery"

export class GetAllUsersQueryHandler implements QueryHandlerInterface {
    public constructor(private _userService: UserServiceInterface) { }

    public async handle(query: QueryInterface): Promise<void> {
        if (!(query instanceof GetAllUsersQuery)) {
            query.executeFailCallback('GetAllUsersQueryHandler can only execute GetAllUsersQuery')
            throw new QueryBusError('GetAllUsersQueryHandler can only execute GetAllUsersQuery')
        }

        try {
            const users = await this._userService.getAllUsers()
            query.executeSuccessCallback(users)
        } catch (error) {
            query.executeFailCallback(error.message)
        }
    }
}