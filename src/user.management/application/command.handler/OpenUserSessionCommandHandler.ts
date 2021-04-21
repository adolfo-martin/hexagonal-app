import { CommandBusError } from "../../../shared.kernel/command/CommandBusError";
import { CommandHandlerInterface } from "../../../shared.kernel/command/CommandHandlerInterface";
import { CommandInterface } from "../../../shared.kernel/command/CommandInterface";
import { OpenUserSessionCommand } from "../../domain/command/OpenUserSessionCommand";
import { UserServiceInterface } from "../../domain/service/UserServiceInterface";

export class OpenUserSessionCommandHandler implements CommandHandlerInterface {

    public constructor(private _userService: UserServiceInterface) { }

    handle(command: CommandInterface): void {
        if (!(command instanceof OpenUserSessionCommand)) {
            throw new CommandBusError(
                "OpenUserSessionCommandHandler can only execute OpenUserSessionCommand"
            )
        }

        const { login, password } = command

        if (!login || !password) {
            command.executeFailCallback('Argument login or password is missing')
            return
        }

        try {
            this._userService.validateUserCredentials(login, password)
                .then((isValid: boolean) =>
                    isValid
                        ? command.executeSuccessCallback(undefined)
                        : command.executeFailCallback('Argument login or password is wrong')
                )
        } catch (error) {
            command.executeFailCallback(error.message)
        }
    }
}