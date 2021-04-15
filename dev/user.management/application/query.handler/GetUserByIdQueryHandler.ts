import { QueryBusError } from "../../../shared.kernel/query/QueryBusError"
import { QueryHandlerInterface } from "../../../shared.kernel/query/QueryHandlerInterface"
import { QueryInterface } from "../../../shared.kernel/query/QueryInterface"
import { UserServiceInterface } from "../../domain/service/UserServiceInterface"
import { GetUserByIdQuery } from "../../domain/query/GetUserByIdQuery"

export class GetUserByIdQueryHandler implements QueryHandlerInterface {
    public constructor(private _userService: UserServiceInterface,) { }

    public handle(query: QueryInterface): void {
        if (!(query instanceof GetUserByIdQuery)) {
            throw new QueryBusError(
                'GetUserByIdQueryHandler can only execute GetUserByIdQuery'
            )
        }

        const id = query.id

        if (!id) {
            query.executeFailCallback('Parameter id is missing')
            return
        }

        try {
            this._userService.getUserById(id).then(users => {
                query.executeSuccessCallback(users)
            })
        } catch (error) {
            query.executeFailCallback(error.message)
        }
    }
}