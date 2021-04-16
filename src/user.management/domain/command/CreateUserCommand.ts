import { CommandAdapter } from "../../../shared.kernel/command/CommandAdapter"

export class CreateUserCommand extends CommandAdapter {
    constructor(
        public readonly id: string,
        public readonly login: string,
        public readonly password: string
    ) {
        super('CreateUserCommand')
        console.log(`CreateUserCommand ${this.id}, ${this.login}, ${this.password}`)
    }
}