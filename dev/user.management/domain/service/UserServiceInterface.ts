import { User } from "../model/User";

export interface UserServiceInterface {
    getAllUsers(): Promise<User[]>
    getUserById(id: string): Promise<User>
    createUser(id: string, login: string, password: string): Promise<User>
    validateUserCredentials(id: string, password: string): Promise<boolean>
}
