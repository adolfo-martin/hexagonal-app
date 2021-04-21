import { CommandBusError } from "../../../shared.kernel/command/CommandBusError";
import { CommandHandlerInterface } from "../../../shared.kernel/command/CommandHandlerInterface";
import { CommandInterface } from "../../../shared.kernel/command/CommandInterface";
import { OpenUserSessionCommand } from "../../domain/command/OpenUserSessionCommand";
import { UserServiceInterface } from "../../domain/service/UserServiceInterface";

export class OpenAdministratorSessionCommandHandler implements CommandHandlerInterface {

    public constructor(private _userService: UserServiceInterface) { }

    async handle(command: CommandInterface): Promise<void> {
        if (!(command instanceof OpenUserSessionCommand)) {
            throw new CommandBusError(
                "OpenAdministratorSessionCommandHandler can only execute OpenAdministratorSessionCommand"
            )
        }

        const { login, password } = command

        if (!login || !password) {
            command.executeFailCallback('Argument login or password is missing')
            return
        }

        try {
            const isValid = await this._userService.validateUserCredentials(login, password)
            isValid
                ? command.executeSuccessCallback(undefined)
                : command.executeFailCallback('Argument login or password is wrong')

            const isAdministrator = await this._userService.validateAdministratorCredentials(login, password)
            isAdministrator
                ? command.executeSuccessCallback(undefined)
                : command.executeFailCallback('The user is not an administrator')
        } catch (error) {
            command.executeFailCallback(error.message)
        }
    }
}