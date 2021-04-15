import { CommandAdapter } from "../../../shared.kernel/command/CommandAdapter"

export class OpenUserSessionCommand extends CommandAdapter {
    constructor(
        public readonly login: string,
        public readonly password: string,
        public readonly token: string,
    ) {
        super('OpenUserSessionCommand')
        console.log(`OpenUserSessionCommand ${this.login}, ${this.password}, ${this.token}`)
    }
}