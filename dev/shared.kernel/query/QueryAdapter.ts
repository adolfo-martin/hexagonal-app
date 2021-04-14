import { QueryInterface } from "./QueryInterface";

export class QueryAdapter implements QueryInterface {
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

    executeSuccessCallback(queryResult: any): void {
        this._successCallback(queryResult)
    }

    executeFailCallback(message: string): void {
        this._failCallback(message)
    }
}