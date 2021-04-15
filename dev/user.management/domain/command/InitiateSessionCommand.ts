import { CommandAdapter } from "../../../shared.kernel/command/CommandAdapter"

export class InitiateSessionCommand extends CommandAdapter {
    constructor(
        public readonly id: string,
        public readonly login: string,
        public readonly password: string
    ) {
        super('InitiateSessionCommand')
        console.log(`InitiateSessionCommand ${this.id}, ${this.login}, ${this.password}`)
    }
}