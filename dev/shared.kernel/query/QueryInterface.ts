export interface QueryInterface {
    className: string
    setSuccessCallback(callback: Function): void
    executeSuccessCallback(queryResult: any): void
    setFailCallback(callback: Function): void
    executeFailCallback(message: string): void
}