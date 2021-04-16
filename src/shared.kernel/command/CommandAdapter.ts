import { CommandInterface } from "./CommandInterface";

export class CommandAdapter implements CommandInterface {
    private _successCallback: Function
    private _failCallback: Function

    constructor(public readonly className: string) {
        this._successCallback = () => { }
        this._failCallback = () => { }
    }

    public setSuccessCallback(callback: Function): void {
        this._successCallback = callback
    }

    public setFailCallback(callback: Function): void {
        this._failCallback = callback
    }

    public executeSuccessCallback(response: any): void {
        this._successCallback(response)
    }

    public executeFailCallback(message: string): void {
        this._failCallback(message)
    }
}