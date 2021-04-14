export interface CommandInterface {
    className: string
    setSuccessCallback(callback: Function): void
    executeSuccessCallback(): void
    setFailCallback(callback: Function): void
    executeFailCallback(message: string): void
}