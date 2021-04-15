import { User } from "../model/User";

export interface UserServiceInterface {
    getAllUsers(): Promise<User[]>
    getUserById(id: string): Promise<User>
    createUser(id: string, login: string, password: string): Promise<User>
    validateUser(id: string, password: string, token: string): Promise<boolean>
}
