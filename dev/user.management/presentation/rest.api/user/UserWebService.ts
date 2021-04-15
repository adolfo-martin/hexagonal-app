// @ts-ignore: Unreachable code error
import express from 'express'
// @ts-ignore: Unreachable code error
import cors from 'cors'
// @ts-ignore: Unreachable code error
import bodyParser from 'body-parser'
import { UserController } from '../../UserController'
import { CommandBusInterface } from '../../../../shared.kernel/command/CommandBusInterface'
import { QueryBusInterface } from '../../../../shared.kernel/query/QueryBusInterface'
import { User } from '../../User'
import { UuidGenerator } from '../../../../shared.kernel/utilities/UuidGenerator'

export class UserWebService {
    private _app
    private _userController: UserController

    constructor(
        private _port: number,
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface,
    ) {
        this._userController = new UserController(this._commandBus, this._queryBus)

        this._app = express()
        this._app.use(cors())
        this._app.use(bodyParser.json())
        this._app.use(bodyParser.urlencoded({ extended: true }))

        // @ts-ignore: Unreachable code error
        this._app.get('/', (req, res, next) =>
            res.send({ ok: false, result: 'Please, you have to use our API' })
        )

        this._app.get('/api/users', this.sendUsers.bind(this))
        this._app.get('/api/user/:id', this.sendUser.bind(this))
        this._app.post('/api/user', this.createUser.bind(this))
    }

    public listen(): void {
        this._app.listen(this._port, () =>
            console.log(`Server listening on port ${this._port}`)
        )
    }

    // @ts-ignore: Unreachable code error
    private sendUsers(req, res, next) {
        const sendSuccessResponse = (users: User[]) => res.send({ ok: true, result: { users } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })
        this._userController.getAllUsers(sendSuccessResponse, sendFailResponse)
    }

    // @ts-ignore: Unreachable code error
    private sendUser(req, res, next) {
        const id: string = req.params.id

        const sendSuccessResponse = (user: User) => res.send({ ok: true, result: { user } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })

        this._userController.getUserById(id, sendSuccessResponse, sendFailResponse)
    }

    // @ts-ignore: Unreachable code error
    private async createUser(req, res, next) {
        const id: string = UuidGenerator.generate()
        const login: string = req.body.login
        const password: string = req.body.password

        const sendSuccessResponse = () => res.send({ ok: true, result: { id } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })

        this._userController.createUser(id, login, password, sendSuccessResponse, sendFailResponse)
    }
}