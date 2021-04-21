import { UserRepository } from './UserRepository'
import { map, mergeMap } from 'rxjs/operators'
import { User } from '../../domain/model/User'
import { UserRepositoryInterface } from '../../domain/repository/UserRepositoryInterface'
import { EMPTY, iif, of } from 'rxjs'

export class UserRepositoryAdapter implements UserRepositoryInterface {
    retrieveUserByLoginAndPassword(
        login: string,
        password: string
    ): Promise<User | undefined> {
        // @ts-ignore: Unreachable code error
        const userPromise: Promise<User | undefined> = UserRepository.getByLoginPassword$(
            login,
            password
        )
            .pipe(
                mergeMap(userP =>
                    iif(
                        () => userP !== undefined,
                        // @ts-ignore: Unreachable code error
                        of(userP).pipe(map(({ id, login, password, type }) => new User(id, login, password, type))),
                        EMPTY
                    )
                )
            )
            .toPromise()

        return userPromise
    }

    retrieveAllUsers(): Promise<User[]> {
        // @ts-ignore: Unreachable code error
        const usersPromise: Promise<User[]> = UserRepository.getAll$()
            .pipe(
                map(users =>
                    users.map(
                        ({ id, login, password, type }) =>
                            new User(id, login, password, type)
                    )
                )
            )
            .toPromise()

        return usersPromise
    }

    retrieveUserById(id: string): Promise<User | undefined> {
        // @ts-ignore: Unreachable code error
        const userPromise: Promise<User | undefined> = UserRepository.getById$(id)
            .pipe(
                mergeMap(userP =>
                    iif(
                        () => userP === undefined,
                        // @ts-ignore: Unreachable code error
                        of(userP).pipe(map(({ id, login, password, type }) => new User(id, login, password, type))),
                        EMPTY
                    )
                )
            )
            .toPromise()
        // if (!userP) {
        //     throw new UserError(`There is not an user with id ${id}`)
        // }
        return userPromise
    }

    createUser(
        id: string,
        login: string,
        password: string,
        type: string
    ): Promise<void> {
        const userPromise: Promise<void> = UserRepository.create$(
            id,
            login,
            password,
            type
        ).toPromise()
        return userPromise
    }
}
