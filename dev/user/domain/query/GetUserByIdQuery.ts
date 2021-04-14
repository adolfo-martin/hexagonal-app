import { QueryAdapter } from "../../../shared.kernel/query/QueryAdapter"

export class GetUserByIdQuery extends QueryAdapter {
    constructor(public readonly id: string) {
        super('GetUserByIdQuery')
        console.log(`GetUserByIdQuery ${this.id}`)
    }
}