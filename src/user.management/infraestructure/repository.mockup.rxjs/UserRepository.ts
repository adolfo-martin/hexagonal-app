import { User } from './User'
import { of, Observable, EMPTY } from 'rxjs'
import { delay } from 'rxjs/operators'
import { UuidGenerator } from '../../../shared.kernel/utilities/UuidGenerator'

export class UserRepository {
    private static _users: User[] = UserRepository._setup()

    private static _setup(): User[] {
        UserRepository._users = []

        UserRepository.create$(
            UuidGenerator.generate(),
            'adolfo',
            'a',
            'administrator'
        ).subscribe()
        UserRepository.create$(
            UuidGenerator.generate(),
            'maria',
            'm',
            'normal'
        ).subscribe()
        return UserRepository._users
    }

    public static getAll$(): Observable<User[]> {
        return of(UserRepository._users).pipe(delay(2000))
    }

    public static getById$(id: string): Observable<User | undefined> {
        return of(UserRepository._users.find(user => user.id === id)).pipe(
            delay(2000)
        )
    }

    public static getByLoginPassword$(
        login: string,
        password: string
    ): Observable<User | undefined> {
        return of(
            UserRepository._users.find(
                user => user.login === login && user.password === password
            )
        ).pipe(delay(2000))
    }

    public static create$(
        id: string,
        login: string,
        password: string,
        type: string
    ): Observable<void> {
        const user = new User(id, login, password, type)
        UserRepository._users.push(user)
        return EMPTY.pipe(delay(2000))
    }
}
