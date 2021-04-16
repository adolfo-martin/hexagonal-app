
import { UserRepository } from './UserRepository'
import { User as UserP } from './User'
import { map } from 'rxjs/operators'
import { User } from '../../domain/model/User'
import { UserRepositoryInterface } from '../../domain/repository/UserRepositoryInterface'

export class UserRepositoryAdapter implements UserRepositoryInterface {
    retrieveUserByLoginAndPassword(login: string, password: string): Promise<User> {
        // @ts-ignore: Unreachable code error
        const userPromise: Promise<User> = UserRepository
            .getByLoginPassword$(login, password)
            .pipe(
                map(userP => (userP ? userP : new UserP('void', 'undefined', 'u'))),
                map(({ id, login, password }) => new User(id, login, password))
            )
            .toPromise()
        // if (!userP) {
        //     throw new UserError(`There is not an user with id ${id}`)
        // }
        return userPromise
    }

    retrieveAllUsers(): Promise<User[]> {
        // @ts-ignore: Unreachable code error
        const usersPromise: Promise<User[]> = UserRepository
            .getAll$()
            .pipe(
                map(users => users.map(({ id, login, password }) => new User(id, login, password)))
            )
            .toPromise()

        return usersPromise
    }

    retrieveUserById(id: string): Promise<User> {
        // @ts-ignore: Unreachable code error
        const userPromise: Promise<User> = UserRepository
            .getById$(id)
            .pipe(
                map(userP => (userP ? userP : new UserP('void', 'undefined', 'u'))),
                map(({ id, login, password }) => new User(id, login, password))
            )
            .toPromise()
        // if (!userP) {
        //     throw new UserError(`There is not an user with id ${id}`)
        // }
        return userPromise
    }

    createUser(id: string, login: string, password: string): Promise<void> {
        const userPromise: Promise<void> = UserRepository
            .create$(id, login, password)
            .toPromise()
        return userPromise
    }
}
