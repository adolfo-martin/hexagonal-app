import { CommandBusError } from '../../../shared.kernel/command/CommandBusError';
import { CommandHandlerInterface } from '../../../shared.kernel/command/CommandHandlerInterface';
import { CommandInterface } from '../../../shared.kernel/command/CommandInterface';
import { OpenAdministratorSessionCommand } from '../../domain/command/OpenAdministratorSessionCommand';
import { UserServiceInterface } from '../../domain/service/UserServiceInterface';

export class OpenAdministratorSessionCommandHandler implements CommandHandlerInterface {

    public constructor(private _userService: UserServiceInterface) { }

    async handle(command: CommandInterface): Promise<void> {
        if (!(command instanceof OpenAdministratorSessionCommand)) {
            command.executeFailCallback('OpenAdministratorSessionCommandHandler can only execute OpenAdministratorSessionCommand')
            throw new CommandBusError('OpenAdministratorSessionCommandHandler can only execute OpenAdministratorSessionCommand')
        }

        const { login, password } = command

        if (!login || !password) {
            command.executeFailCallback('Argument login or password is missing')
            return
        }

        try {
            const isValid = await this._userService.validateUserCredentials(login, password)
            if (!isValid) {
                command.executeFailCallback('Argument login or password is wrong')
                return
            }

            const isAdministrator = await this._userService.validateAdministratorCredentials(login, password)
            if (!isAdministrator) {
                command.executeFailCallback('The user is not an administrator')
                return
            }

            command.executeSuccessCallback(undefined)
        } catch (error) {
            command.executeFailCallback(error.message)
        }
    }
}