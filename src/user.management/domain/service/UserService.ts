import { UserRepositoryInterface } from '../repository/UserRepositoryInterface'
import { User } from '../model/User'
import { UserCreatedDomainEvent } from '../event/UserCreatedDomainEvent'
import { UserServiceInterface } from './UserServiceInterface'
import { DomainEventDispatcher } from '../../../shared.kernel/event/DomainEventDispatcher'

export class UserService implements UserServiceInterface {
    constructor(
        private _domainEventDispatcher: DomainEventDispatcher,
        private _userRepository: UserRepositoryInterface
    ) { }

    public async validateUserCredentials(
        login: string,
        password: string
    ): Promise<boolean> {
        const user = await this._userRepository.retrieveUserByLoginAndPassword(login, password)
        if (user) {
            return user.isValidPassword(password)
        } else {
            return false
        }
    }

    public async getAllUsers(): Promise<User[]> {
        const users = await this._userRepository.retrieveAllUsers()
        return users
    }

    public async getUserById(id: string): Promise<User | undefined> {
        const user = await this._userRepository.retrieveUserById(id)
        return user
    }

    public async createUser(
        id: string,
        login: string,
        password: string,
        type: string
    ): Promise<User> {
        await this._userRepository.createUser(id, login, password, type)
        const user = new User(id, login, password, type)
        const event = new UserCreatedDomainEvent(id, user)
        this._domainEventDispatcher.dispatch(event)
        return user
    }
}
