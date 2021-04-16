export class CommandBusError extends Error {
    public constructor(message: string) {
        super(message)
        this.name = 'CommandBusError'
    }
}