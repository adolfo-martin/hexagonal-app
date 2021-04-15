import { CommandBusError } from "../../../shared.kernel/command/CommandBusError";
import { CommandHandlerInterface } from "../../../shared.kernel/command/CommandHandlerInterface";
import { CommandInterface } from "../../../shared.kernel/command/CommandInterface";
import { CreateUserCommand } from "../../domain/command/CreateUserCommand";
import { UserServiceInterface } from "../../domain/service/UserServiceInterface";


export class CreateUserCommandHandler implements CommandHandlerInterface {
    public constructor(private _userService: UserServiceInterface) { }

    public handle(command: CommandInterface): void {
        if (!(command instanceof CreateUserCommand)) {
            throw new CommandBusError(
                "CreateUserCommandHandler can only execute CreateUserCommand"
            );
        }

        const id = command.id
        const login = command.login
        const password = command.password

        if (!id || !login || !password) {
            command.executeFailCallback('Parameter id, login or password is missing')
            return
        }

        try {
            this._userService.createUser(id, login, password).then(() => {
                command.executeSuccessCallback()
            })
        } catch (error) {
            command.executeFailCallback(error.message)
        }
    }
}
