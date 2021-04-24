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
import { TokenSessionUtility } from '../../../../shared.kernel/utilities/TokenSessionUtility'

export class UserWebService {
    // @ts-ignore: Unreachable code error
    private _app: express.Express
    private _userController: UserController

    constructor(
        private _port: number,
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface
    ) {
        this._userController = new UserController(
            this._commandBus,
            this._queryBus
        )

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
        this._app.get(
            '/api/users',
            this._validateToken.bind(this),
            this._validateAdministratorCredentials.bind(this),
            this._sendUsers.bind(this)
        )

        this._app.get(
            '/api/user/:id',
            this._validateToken.bind(this),
            this._validateAdministratorCredentials.bind(this),
            this._sendUser.bind(this)
        )

        this._app.post(
            '/api/user',
            this._validateToken.bind(this),
            this._validateAdministratorCredentials.bind(this),
            this._createUser.bind(this)
        )

        this._app.post(
            '/api/user/authenticate',
            this._openUserSession.bind(this)
        )

        this._app.post(
            '/api/user/authenticate-administrator',
            this._openAdministratorSession.bind(this)
        )
    }

    private _configureInvalidRoutes() {
        this._app.all(
            '*',
            (
                req: express.Request,
                res: express.Response,
                next: express.NextFunction
            ) =>
                res.status(404).send({
                    ok: false,
                    result: 'Please, you have to use our API',
                })
        )
    }

    public listen(): void {
        this._app.listen(this._port, () =>
            console.log(`Server listening on port ${this._port}`)
        )
    }

    private _validateToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            res.status(401).send({
                ok: false,
                result: {
                    error: 'Token is not valid. User must validate again.',
                },
            })
            res.locals.authenticated = false
            return
        }

        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({
                ok: false,
                result: { error: 'Cannot get remote access.' },
            })
            res.locals.authenticated = false
            return
        }

        if (!TokenSessionUtility.isValidToken(token, remoteAddress)) {
            res.status(401).send({
                ok: false,
                result: {
                    error: 'Token is not valid. User must validate again.',
                },
            })
            res.locals.authenticated = false
            return
        }

        res.locals.authenticated = true
        res.locals.token = token
        next()
    }

    private _validateAdministratorCredentials(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const data = TokenSessionUtility.decodeToken(res.locals.token)
        
        // @ts-ignore: Unreachable code error
        console.log('###################', data.type)
        // @ts-ignore: Unreachable code error
        const userType: string = data.type
        if (userType !== 'administrator') {
            res.status(403).send({
                ok: false,
                result: {
                    error: 'User does not have enough permissions to make the required operation.',
                },
            })
            return
        }

        next()
    }

    private async _sendUsers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const sendSuccessResponse = (users: User[]) =>
            res.send({ ok: true, result: { users } })
        const sendFailResponse = (error: string) =>
            res.status(401).send({ ok: false, result: { error } })

        this._userController.getAllUsers(sendSuccessResponse, sendFailResponse)
    }

    private async _sendUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const id: string = req.params.id

        const sendSuccessResponse = (user: User) => res.send({ ok: true, result: { user } })
        const sendFailResponse = (error: string) => res.send({ ok: false, result: { error } })

        this._userController.getUserById(id, sendSuccessResponse, sendFailResponse)
    }

    private async _createUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const login: string = req.body.login
        const password: string = req.body.password
        const type: string = req.body.type

        const sendSuccessResponse = (id: string) =>
            res.send({ ok: true, result: { id } })
        const sendFailResponse = (error: string) =>
            res.send({ ok: false, result: { error } })

        this._userController.createUser(
            login,
            password,
            type,
            sendSuccessResponse,
            sendFailResponse
        )
    }

    private async _openUserSession(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const login: string = req.body.login
        const password: string = req.body.password
        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({
                ok: false,
                result: { error: 'Cannot get remote access.' },
            })
            return
        }

        const token = TokenSessionUtility.generateToken(login, remoteAddress)

        const sendSuccessResponse = (_: any) =>
            res.send({ ok: true, result: { token } })
        const sendFailResponse = (error: string) =>
            res.status(401).send({ ok: false, result: { error } })

        this._userController.openUserSession(
            login,
            password,
            sendSuccessResponse,
            sendFailResponse
        )
    }

    private async _openAdministratorSession(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const login: string = req.body.login
        const password: string = req.body.password
        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({
                ok: false,
                result: { error: 'Cannot get remote access.' },
            })
            return
        }

        const token = TokenSessionUtility.generateToken(login, remoteAddress, 'administrator')

        const sendSuccessResponse = (_: any) =>
            res.send({ ok: true, result: { token } })
        const sendFailResponse = (error: string) =>
            res.status(401).send({ ok: false, result: { error } })

        this._userController.openAdministratorSession(
            login,
            password,
            sendSuccessResponse,
            sendFailResponse
        )
    }
}
