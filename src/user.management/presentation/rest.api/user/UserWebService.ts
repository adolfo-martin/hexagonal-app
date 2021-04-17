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

export class UserWebService {
    // @ts-ignore: Unreachable code error
    private _app: express.Express
    private _userController: UserController


    constructor(
        private _port: number,
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface,
    ) {
        this._userController = new UserController(this._commandBus, this._queryBus)

        this._setupExpressServer()
        this._configureValidRoutes()
        this._configureInvalidRoutes()
    }


    private _setupExpressServer() {
        this._app = express()
        this._app.use(cors())
        this._app.use(bodyParser.json())
        this._app.use(bodyParser.urlencoded({ extended: true }))

        this._configureValidRoutes()
        this._configureInvalidRoutes()
    }


    private _configureValidRoutes() {
        this._app.get('/api/users', this._sendUsers.bind(this))
        this._app.get('/api/user/:id', this._sendUser.bind(this))
        this._app.post('/api/user', this._createUser.bind(this))
        this._app.post('/api/user/authenticate', this._openUserSession.bind(this));
    }


    private _configureInvalidRoutes() {
        this._app.all('*', (req, res, next) =>
            res.status(404).send({ ok: false, result: 'Please, you have to use our API' })
        )
    }


    public listen(): void {
        this._app.listen(this._port, () =>
            console.log(`Server listening on port ${this._port}`)
        )
    }


    private async _sendUsers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            res.status(401).send({ ok: false, result: { error: 'Token is not valid. User must validate again.' } })
            return
        }

        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({ ok: false, result: { error: 'Cannot get remote access.' } })
            return
        }

        const sendSuccessResponse = (users: User[]) => res.send({ ok: true, result: { users } })
        const sendFailResponse = (error: string) => res.status(401).send({ ok: false, result: { error } })

        this._userController.getAllUsers(sendSuccessResponse, sendFailResponse, token, remoteAddress)
    }


    private async _sendUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id

        const sendSuccessResponse = (user: User) => res.send({ ok: true, result: { user } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })

        this._userController.getUserById(id, sendSuccessResponse, sendFailResponse)
    }


    private async _createUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        const login: string = req.body.login
        const password: string = req.body.password

        const sendSuccessResponse = (id: string) => res.send({ ok: true, result: { id } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })

        this._userController.createUser(login, password, sendSuccessResponse, sendFailResponse)
    }


    private async _openUserSession(req: express.Request, res: express.Response, next: express.NextFunction) {
        const login: string = req.body.login
        const password: string = req.body.password
        // const remoteAddress: string = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({ ok: false, result: { error: 'Cannot get remote access.' } })
            return
        }

        const sendSuccessResponse = (token: string) => res.send({ ok: true, result: { token } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })

        this._userController.openUserSession(login, password, remoteAddress, sendSuccessResponse, sendFailResponse)
    }
}