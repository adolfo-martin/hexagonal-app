import { CommandAdapter } from "../../../shared.kernel/command/CommandAdapter"

export class OpenAdministratorSessionCommand extends CommandAdapter {
    constructor(
        public readonly login: string,
        public readonly password: string,
    ) {
        super('OpenAdministratorSessionCommand')
    }
}