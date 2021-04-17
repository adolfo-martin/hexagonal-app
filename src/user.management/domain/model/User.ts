export class User {
    constructor(
        public readonly id: string,
        public readonly login: string,
        public readonly password: string,
        public readonly type: string
    ) {}

    public isValidPassword(password: string): boolean {
        return password === this.password ? true : false
    }
}
