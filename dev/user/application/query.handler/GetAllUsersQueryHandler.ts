import { QueryBusError } from "../../../shared.kernel/query/QueryBusError"
import { QueryHandlerInterface } from "../../../shared.kernel/query/QueryHandlerInterface"
import { QueryInterface } from "../../../shared.kernel/query/QueryInterface"
import { UserServiceInterface } from "../../domain/service/UserServiceInterface"
import { GetAllUsersQuery } from "../../domain/query/GetAllUsersQuery"

export class GetAllUsersQueryHandler implements QueryHandlerInterface {
    public constructor(private _userService: UserServiceInterface) { }

    public handle(query: QueryInterface): void {
        if (!(query instanceof GetAllUsersQuery)) {
            throw new QueryBusError(
                'GetAllUsersQueryHandler can only execute GetAllUsersQuery'
            )
        }

        try {
            this._userService.getAllUsers().then(users => {
                query.executeSuccessCallback(users)
            })
        } catch (error) {
            query.executeFailCallback(error.message)
        }
    }
}