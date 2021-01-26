export declare type AppProps = {
    name: string;
};
export declare type Timer = {
    uptime: number;
    seconds: number;
    updateCount: number;
    lastFrameTime: number;
    lastSixtyFramesTimes: number[];
    frameTimeAverage: number;
    FPS: number;
};
export default class App {
    protected appTime: Timer;
    constructor(props: AppProps);
    update(): Promise<number>;
    private diagnosticsUpdate;
}
