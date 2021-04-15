import { User } from '../model/User'

export interface UserRepositoryInterface {
    retrieveAllUsers(): Promise<User[]>
    retrieveUserById(id: string): Promise<User>
    createUser(id: string, login: string, password: string): Promise<void>
}
