import { UserRepositoryInterface } from "../repository/UserRepositoryInterface"
import { User } from "../model/User"
import { UserCreatedDomainEvent } from "../event/UserCreatedDomainEvent"
import { UserServiceInterface } from "./UserServiceInterface"
import { DomainEventDispatcher } from "../../../shared.kernel/event/DomainEventDispatcher"

export class UserService implements UserServiceInterface {
    constructor(
        private _domainEventDispatcher: DomainEventDispatcher,
        private _userRepository: UserRepositoryInterface,
    ) { }

    public async validateUser(id: string, password: string, token: string): Promise<boolean> {
        const user = await this._userRepository.retrieveUserById(id)
        return user.isValidPassword(password)
    }

    public async getAllUsers(): Promise<User[]> {
        const users = await this._userRepository.retrieveAllUsers()
        return users
    }

    public async getUserById(id: string): Promise<User> {
        const user = await this._userRepository.retrieveUserById(id)
        return user
    }

    public async createUser(id: string, login: string, password: string): Promise<User> {
        await this._userRepository.createUser(id, login, password)
        const user = new User(id, login, password)
        const event = new UserCreatedDomainEvent(id, user)
        this._domainEventDispatcher.dispatch(event)
        return user
    }
}