import { User } from '../model/User'

export interface UserRepositoryInterface {
    retrieveAllUsers(): Promise<User[]>
    retrieveUserById(id: string): Promise<User | undefined>
    retrieveUserByLoginAndPassword(
        login: string,
        password: string
    ): Promise<User | undefined>
    createUser(
        id: string,
        login: string,
        password: string,
        type: string
    ): Promise<void>
}
