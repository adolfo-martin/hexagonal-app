import { CommandBusError } from '../../../shared.kernel/command/CommandBusError';
import { CommandHandlerInterface } from '../../../shared.kernel/command/CommandHandlerInterface';
import { CommandInterface } from '../../../shared.kernel/command/CommandInterface';
import { OpenUserSessionCommand } from '../../domain/command/OpenUserSessionCommand';
import { UserServiceInterface } from '../../domain/service/UserServiceInterface';

export class OpenUserSessionCommandHandler implements CommandHandlerInterface {

    public constructor(private _userService: UserServiceInterface) { }

    async handle(command: CommandInterface): Promise<void> {
        if (!(command instanceof OpenUserSessionCommand)) {
            command.executeFailCallback('OpenUserSessionCommandHandler can only execute OpenUserSessionCommand')
            throw new CommandBusError('OpenUserSessionCommandHandler can only execute OpenUserSessionCommand')
        }

        const { login, password } = command

        if (!login || !password) {
            command.executeFailCallback('Argument login or password is missing')
            return
        }

        try {
            const isValid: boolean = await this._userService.validateUserCredentials(login, password)
            if (!isValid) {
                command.executeFailCallback('Argument login or password is wrong')
                return
            }

            command.executeSuccessCallback(undefined)
        } catch (error) {
            command.executeFailCallback(error.message)
        }
    }
}