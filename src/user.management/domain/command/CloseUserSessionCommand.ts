import { CommandAdapter } from "../../../shared.kernel/command/CommandAdapter"

export class CloseUserSessionCommand extends CommandAdapter {
    constructor(
        public readonly id: string,
        public readonly login: string,
        public readonly password: string
    ) {
        super('CloseUserSessionCommand')
    }
}