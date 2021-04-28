import { CommandBusError } from '../../../shared.kernel/command/CommandBusError'
import { CommandHandlerInterface } from '../../../shared.kernel/command/CommandHandlerInterface'
import { CommandInterface } from '../../../shared.kernel/command/CommandInterface'
import { CreateUserCommand } from '../../domain/command/CreateUserCommand'
import { UserServiceInterface } from '../../domain/service/UserServiceInterface'

export class CreateUserCommandHandler implements CommandHandlerInterface {
    public constructor(private _userService: UserServiceInterface) { }

    public async handle(command: CommandInterface): Promise<void> {
        if (!(command instanceof CreateUserCommand)) {
            command.executeFailCallback('CreateUserCommandHandler can only execute CreateUserCommand')
            throw new CommandBusError('CreateUserCommandHandler can only execute CreateUserCommand')
        }

        const { id, login, password, type } = command

        if (!id || !login || !password || !type) {
            command.executeFailCallback('Argument id, login, password or type is missing')
            return
        }

        try {
            await this._userService.createUser(id, login, password, type)
            command.executeSuccessCallback(id)
        } catch (error) {
            command.executeFailCallback(error.message)
        }
    }
}
