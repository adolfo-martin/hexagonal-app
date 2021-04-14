export class User {
    constructor(
        private _id: number,
        private _login: string
    ) {}

    public get id(): number {
        return this._id
    }

    public get login(): string {
        return this._login
    }
}
