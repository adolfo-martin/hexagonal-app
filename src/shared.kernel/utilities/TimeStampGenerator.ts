export class TimeStampGenerator {
    public static generate(): number {
        // @ts-ignore: Unreachable code error
        const timeStamp: number = (Date.now || function () {
            return +new Date;
        })()

        return timeStamp
    }
}