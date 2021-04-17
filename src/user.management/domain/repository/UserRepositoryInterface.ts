import { User } from '../model/User'

export interface UserRepositoryInterface {
    retrieveAllUsers(): Promise<User[]>
    retrieveUserById(id: string): Promise<User>
    retrieveUserByLoginAndPassword(
        login: string,
        password: string
    ): Promise<User>
    createUser(
        id: string,
        login: string,
        password: string,
        type: string
    ): Promise<void>
}
