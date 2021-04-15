import { CommandInterface } from "./CommandInterface";

export class CommandAdapter implements CommandInterface {
    private _successCallback: Function
    private _failCallback: Function

    constructor(public readonly className: string) {
        this._successCallback = () => { }
        this._failCallback = () => { }
    }

    setSuccessCallback(callback: Function): void {
        this._successCallback = callback
    }

    setFailCallback(callback: Function): void {
        this._failCallback = callback
    }

    executeSuccessCallback(response: any): void {
        this._successCallback()
    }

    executeFailCallback(message: string): void {
        this._failCallback(message)
    }
}