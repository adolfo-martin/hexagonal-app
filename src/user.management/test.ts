import { Application } from "../shared.kernel/Application"
import { DomainEventDispatcher } from "../shared.kernel/event/DomainEventDispatcher"
import { CreateUserCommandHandler } from "./application/command.handler/CreateUserCommandHandler"
import { OpenUserSessionCommandHandler } from "./application/command.handler/OpenUserSessionCommandHandler"
import { GetAllUsersQueryHandler } from "./application/query.handler/GetAllUsersQueryHandler"
import { GetUserByIdQueryHandler } from "./application/query.handler/GetUserByIdQueryHandler"
import { UserCreatedDomainEvent } from "./domain/event/UserCreatedDomainEvent"
import { UserService } from "./domain/service/UserService"
import { UserServiceInterface } from "./domain/service/UserServiceInterface"
import { UserRepositoryAdapter } from "./infraestructure/repository.mockup.rxjs/UserRepositoryAdapter"
import { UserWebService } from "./presentation/rest.api/user/UserWebService"

import { ajax } from 'rxjs/ajax'
// @ts-ignore: Unreachable code error
import { XMLHttpRequest } from 'xmlhttprequest'
import { map, catchError } from "rxjs/operators"
import { SynchronousCommmandBus } from "../shared.kernel/bus.synchronous/SynchronousCommandBus"
import { SynchronousQueryBus } from "../shared.kernel/bus.synchronous/SynchronousQueryBus"
import { of } from "rxjs"
import { OpenAdministratorSessionCommandHandler } from "./application/command.handler/OpenAdministratorSessionCommandHandler"

const commandBus = new SynchronousCommmandBus()
const queryBus = new SynchronousQueryBus()
const domainEventDispatcher = new DomainEventDispatcher
const userRepository = new UserRepositoryAdapter()
const userService: UserServiceInterface = new UserService(domainEventDispatcher, userRepository)

domainEventDispatcher.register('user_created_domain_event', {
    handle: (event: UserCreatedDomainEvent) => console.log(event)
})

const webServiceUser = new UserWebService(5000, commandBus, queryBus)

Application.setup(commandBus, queryBus, domainEventDispatcher, userRepository)
Application.run(runnable)

webServiceUser.listen()

testRestApi()

function runnable() {
    commandBus.register(
        'CreateUserCommand',
        new CreateUserCommandHandler(userService)
    )

    commandBus.register(
        'OpenAdministratorSessionCommand',
        new OpenAdministratorSessionCommandHandler(userService)
    )

    commandBus.register(
        'OpenUserSessionCommand',
        new OpenUserSessionCommandHandler(userService)
    )

    queryBus.register(
        'GetAllUsersQuery',
        new GetAllUsersQueryHandler(userService)
    )

    queryBus.register(
        'GetUserByIdQuery',
        new GetUserByIdQueryHandler(userService)
    )
}

function testRestApi() {
    testWrongUserCredentials()
    testRightUserCredentials()
    testWrongAdministratorCredentials()
    testRightAdministratorCredentials()
    // testRightFindUsers()

    setTimeout(webServiceUser.close, 10000)
}

// function testRightFindUsers() {
//     const url = 'http://127.0.0.1:5000/api/users'

//     const data = {
//         login: 'adolfo',
//         password: 'wrong',
//     }

//     function createXHR() {
//         return new XMLHttpRequest();
//     }

//     ajax({
//         url,
//         method: 'post',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         createXHR,
//         crossDomain: true,
//         // withCredentials: false,
//         body: JSON.stringify(data),
//     })
//         .pipe(
//             map(response => console.error('[FAIL] Right find users.')),
//             catchError(response => of(response.status === 401 ? '[OK] Right find users.' : '[FAIL] Right find users.')),
//         )
//         .subscribe(console.log)
// }

function testWrongUserCredentials() {
    const url = 'http://127.0.0.1:5000/api/user/authenticate'

    const data = {
        login: 'adolfo',
        password: 'wrong',
    }

    ajax({
        url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        createXHR: () => new XMLHttpRequest(),
        crossDomain: true,
        // withCredentials: false,
        body: JSON.stringify(data),
    })
        .pipe(
            map(response => console.error('[FAIL] Wrong user credentials.')),
            catchError(response => of(response.status === 401 ? '[OK] Wrong user credentials.' : '[FAIL] Wrong user credentials.')),
        )
        .subscribe(console.log)
}

function testRightUserCredentials() {
    const url = 'http://127.0.0.1:5000/api/user/authenticate'

    const data = {
        login: 'adolfo',
        password: 'a',
    }

    function createXHR() {
        return new XMLHttpRequest();
    }

    ajax({
        url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        createXHR,
        crossDomain: true,
        // withCredentials: false,
        body: JSON.stringify(data),
    })
        .pipe(
            map(response => console.error('[OK] Right user credentials.')),
            catchError(response => of('[FAIL] Right user credentials.')),
        )
        .subscribe(console.log)
}

function testWrongAdministratorCredentials() {
    const url = 'http://127.0.0.1:5000/api/user/authenticate-administrator'

    const data = {
        login: 'maria',
        password: 'm',
    }

    function createXHR() {
        return new XMLHttpRequest();
    }

    ajax({
        url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        createXHR,
        crossDomain: true,
        // withCredentials: false,
        body: JSON.stringify(data),
    })
        .pipe(
            map(response => console.error('[FAIL] Wrong administrator credentials.')),
            catchError(response => of(response.status === 403 ? '[OK] Wrong administrator credentials.' : '[FAIL] Wrong administrator credentials.')),
        )
        .subscribe(console.log)
}

function testRightAdministratorCredentials() {
    const url = 'http://127.0.0.1:5000/api/user/authenticate-administrator'

    const data = {
        login: 'adolfo',
        password: 'a',
    }

    function createXHR() {
        return new XMLHttpRequest();
    }

    ajax({
        url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        createXHR,
        crossDomain: true,
        // withCredentials: false,
        body: JSON.stringify(data),
    })
        .pipe(
            map(response => console.error('[OK] Right administrator credentials.')),
            catchError(response => of('[FAIL] Right administrator credentials.')),
        )
        .subscribe(console.log)
}


    // const response = await fetch(authUrl, {
    //     method: 'POST',
    //     body: datosEnvio,
    // })

    // console.log(response)
    // if (!response.ok) {
    //     console.log('[OK] Test 001. Wrong user.')
    // } else {
    //     console.log('[OK] Test 001. Wrong user.')
    // }

    // const data = await response.json()

    // if (datos.estado === 'error') {
    //     alert(`ERROR (solicitarToken): Problema al generar el token de acceso`);
    //     return null
    // }

    // return datos.resultado.token

//     try {
//         var cabeceras = new Headers()
//         cabeceras.append("Authorization", `Bearer ${token}`)
//         cabeceras.append("Content-Type", "application/x-www-form-urlencoded")

//         //const respuesta = await fetch(`${URL_BASE}/backend/token-servicio.php`, {
//         const respuesta = await fetch('../../backend/token-servicio.php', {
//             method: 'GET',
//             headers: cabeceras,
//             redirect: 'follow'
//         })
//         const datos = await respuesta.json()
//         if (datos.estado === 'error') {
//             alert(`ERROR: ${datos.mensaje}`)
//             window.location = 'https://aulavirtual.iesramonarcas.es/login/index.php'
//         }

//         const parseJwt = (token) => {
//             try {
//                 return JSON.parse(atob(token.split('.')[1]));
//             } catch (e) {
//                 alert('ERROR. Problema al decodificar el token de acceso.')
//                 window.location = 'https://aulavirtual.iesramonarcas.es/login/index.php'
//                 // const ventana = window.open("about:blank", "_self")
//                 // ventana.close()
//             }
//         }
//         const tokenDecodificado = parseJwt(token)

//         if (!tokenDecodificado.usuario || !tokenDecodificado.curso) {
//             alert('Intento de acceso ilegal.')
//             window.location = 'https://aulavirtual.iesramonarcas.es/login/index.php'
//         }

//         return {
//             usuario: tokenDecodificado.usuario,
//             curso: tokenDecodificado.curso
//         }
//     } catch (e) {
//         alert(`Problema al recuperar los datos. ${e.message}`)
//         window.
//     }