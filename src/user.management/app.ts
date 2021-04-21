import { Application } from "../shared.kernel/Application"
import { DomainEventDispatcher } from "../shared.kernel/event/DomainEventDispatcher"
import { CreateUserCommandHandler } from "./application/command.handler/CreateUserCommandHandler"
import { OpenAdministratorSessionCommandHandler } from "./application/command.handler/OpenAdministratorSessionCommandHandler"
import { OpenUserSessionCommandHandler } from "./application/command.handler/OpenUserSessionCommandHandler"
import { GetAllUsersQueryHandler } from "./application/query.handler/GetAllUsersQueryHandler"
import { GetUserByIdQueryHandler } from "./application/query.handler/GetUserByIdQueryHandler"
import { UserCreatedDomainEvent } from "./domain/event/UserCreatedDomainEvent"
import { UserService } from "./domain/service/UserService"
import { UserServiceInterface } from "./domain/service/UserServiceInterface"
import { SynchronousCommmandBus } from "./infraestructure/bus.synchronous/SynchronousCommandBus"
import { SynchronousQueryBus } from "./infraestructure/bus.synchronous/SynchronousQueryBus"
import { UserRepositoryAdapter } from "./infraestructure/repository.mockup.rxjs/UserRepositoryAdapter"
import { UserWebService } from "./presentation/rest.api/user/UserWebService"


const commandBus = new SynchronousCommmandBus()
const queryBus = new SynchronousQueryBus()
const domainEventDispatcher = new DomainEventDispatcher
const userRepository = new UserRepositoryAdapter()
const userService: UserServiceInterface = new UserService(domainEventDispatcher, userRepository)

domainEventDispatcher.register('user_created_domain_event', {
    handle: (event: UserCreatedDomainEvent) => console.log(event)
})

const webServiceUser = new UserWebService(5000, commandBus, queryBus)

Application.setup(commandBus, queryBus, domainEventDispatcher, userRepository)
Application.run(runnable)

webServiceUser.listen()

function runnable() {
    commandBus.register(
        'OpenAdministratorSessionCommand',
        new OpenAdministratorSessionCommandHandler(userService)
    )

    commandBus.register(
        'OpenUserSessionCommand',
        new OpenUserSessionCommandHandler(userService)
    )

    commandBus.register(
        'CreateUserCommand',
        new CreateUserCommandHandler(userService)
    )

    queryBus.register(
        'GetAllUsersQuery',
        new GetAllUsersQueryHandler(userService)
    )

    queryBus.register(
        'GetUserByIdQuery',
        new GetUserByIdQueryHandler(userService)
    )
}

