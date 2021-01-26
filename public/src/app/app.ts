import Mathematics from './lib/mathematics';
import _ from 'lodash';

export type AppProps = {
	name: string;
	dev?: boolean;
};

export type Timer = {
	uptime:number,
	seconds:number,
	updateCount: number,
	lastFrameTime: number,
	lastSixtyFramesTimes: number[],
	frameTimeAverage: number,
	FPS: number
}

export default class App {
	protected appTime:Timer= {uptime:0, seconds:0, updateCount: 0, lastFrameTime:0, lastSixtyFramesTimes:[], frameTimeAverage: 0, FPS: 0};
	constructor (props:AppProps) {
		this.update();
		if(props.dev) {
			window['app'] = this;
		}
	}

	/**
	 * @public
	 * @async
	 * @description Updates state and DOM if changes
	 */
	public async update():Promise<number> {
		window.requestAnimationFrame(async ()=>{
			this.diagnosticsUpdate(await this.update());
		});
		return performance.now();
	}

	private diagnosticsUpdate(newTime:number) {
		const lastFrame = newTime - this.appTime.uptime;
		const mean = _.mean(this.appTime.lastSixtyFramesTimes);
		const fps = 1000/(this.appTime.frameTimeAverage || 1);
		if(this.appTime.lastSixtyFramesTimes.length > 60) {
			this.appTime.lastSixtyFramesTimes.shift();
		}
		this.appTime = {
			uptime: newTime,
			seconds:Number((newTime/1000).toFixed(3)),
			updateCount: this.appTime.updateCount+1,
			lastFrameTime: lastFrame,
			lastSixtyFramesTimes: [...this.appTime.lastSixtyFramesTimes, lastFrame],
			frameTimeAverage: mean,
			FPS: fps
		};
	}
}
