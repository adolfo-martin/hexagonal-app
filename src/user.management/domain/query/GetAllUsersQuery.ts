import { QueryAdapter } from "../../../shared.kernel/query/QueryAdapter"

export class GetAllUsersQuery extends QueryAdapter {
    constructor() {
        super('GetAllUsersQuery')
        console.log('GetAllUsersQuery')
    }
}