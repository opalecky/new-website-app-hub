import _                                from 'lodash';
import Background, { BACKGROUND_TYPES } from "./components/background";
import DOMHelper                        from "./lib/dom-helper";
import Mathematics                      from './lib/mathematics';
//@ts-ignore
import GlobalTranslations               from './translations/global.json';

export enum AVAILABLE_LANGUAGES {
	EN = 'english',
	CZ = 'czech'
}

export type AppProps = {
	name : string;
	dev? : DevSettings;
};

export type DevSettings = {
	on : boolean;
	maximumSavedFrametimes : number;
}

export type AppEventListener = {
	type : string;
	callBack : ( ...props : any[] ) => void;
}

export type Timer = {
	uptime : number,
	seconds : number,
	updateCount : number,
	lastFrameTime : number,
	storedFrameTimes : number[],
	frameTimeAverage : number,
	FPS : number,
	initialized : number,
	lastUpdate : number,
	inAppTime : number
}

export type updateFunction = {
	props : any[],
	f : ( ...props : any[] ) => any
}

export type DebugOptions = {
	statsGraph : boolean;
}

export default class App {

	public appTime : Timer = {
		uptime : 0,
		seconds : 0,
		updateCount : 0,
		lastFrameTime : 0,
		storedFrameTimes : [],
		frameTimeAverage : 0,
		FPS : 0,
		initialized : Date.now(),
		lastUpdate : Date.now(),
		inAppTime : 0,
	};
	private updateFunctionStack : updateFunction[] = [];
	private debugStatsGraph? : HTMLCanvasElement;
	private debugOptions? : DebugOptions;
	private debugStatsGraphAverages? : number[] = [];

	private readonly maximumSavedFrameTimes;
	private background : Background;

	private translations;
	private language : string = AVAILABLE_LANGUAGES.EN;

	private events = {};

	constructor ( props : AppProps ) {
		$.get( './lang/english.json', ( data ) => {
			this.translations = _.merge(data, GlobalTranslations);
			this.translate();
		} );

		$( '.language-selector a' ).on( 'click', ( e ) => {
			this.changeLanguage( $( e.target ).data( 'value' ) );
		} );

		this.update();
		if ( props.dev && props.dev.on ) {
			window[ 'app' ] = this;
			this.maximumSavedFrameTimes = props.dev.maximumSavedFrametimes
		} else {
			this.maximumSavedFrameTimes = 60;
		}
	}

	setBackground ( type : any ) {
		if ( BACKGROUND_TYPES.hasOwnProperty( type ) ) {
			this.background = new Background( { type : type, app : this } )
		}
	}

	/**
	 * @public
	 * @async
	 * @description Updates state and DOM if changes
	 */
	public async update () : Promise<number> {
		for ( const func of this.updateFunctionStack ) {
			func.f( ...func.props );
		}
		window.requestAnimationFrame( async () => {
			this.timeUpdate( await this.update() );
		} );
		return performance.now();
	}

	private timeUpdate ( newTime : number ) {
		const lastFrame = newTime - this.appTime.uptime;
		const mean = _.mean( this.appTime.storedFrameTimes );
		const fps = 1000 / ( this.appTime.frameTimeAverage || 1 );
		if ( this.appTime.storedFrameTimes.length > this.maximumSavedFrameTimes ) {
			this.appTime.storedFrameTimes.shift();
		}
		this.appTime = {
			uptime : newTime,
			seconds : Number( ( newTime / 1000 ).toFixed( 3 ) ),
			updateCount : this.appTime.updateCount + 1,
			lastFrameTime : lastFrame,
			storedFrameTimes : [ ...this.appTime.storedFrameTimes, lastFrame ],
			frameTimeAverage : mean,
			FPS : fps,
			initialized : this.appTime.initialized,
			lastUpdate : Date.now(),
			inAppTime : Date.now() - this.appTime.initialized,
		};
		if ( this.debugOptions?.statsGraph ) {
			this.$$drawDiagnosticData();
		}
	}

	private $$drawDiagnosticData () {
		const ctx = this.debugStatsGraph.getContext( '2d' );
		ctx.clearRect( this.debugStatsGraph.width / 2, 0, this.debugStatsGraph.width / 2, this.debugStatsGraph.height );

		// FPS counter
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.font = "16px Roboto";
		ctx.fillText( `FPS: ${ this.appTime.FPS.toFixed( 3 ) }`, this.debugStatsGraph.width / 2, this.debugStatsGraph.height / 3, this.debugStatsGraph.width / 10 )
		ctx.closePath();

		// Average frame time counter
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.font = "16px Roboto";
		ctx.fillText( `AFT: ${ this.appTime.frameTimeAverage.toFixed( 3 ) }`, this.debugStatsGraph.width / 2, 2 * this.debugStatsGraph.height / 3, this.debugStatsGraph.width / 10 )
		ctx.closePath();

		// Last frame time counter
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.font = "16px Roboto";
		ctx.fillText( `Total Frames: ${ this.appTime.updateCount }`, this.debugStatsGraph.width / 2 + this.debugStatsGraph.width / 15, 2 * this.debugStatsGraph.height / 3, this.debugStatsGraph.width / 4 )
		ctx.closePath();

		// Last frame time counter
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.font = "16px Roboto";
		ctx.fillText( `Frame time: ${ this.appTime.lastFrameTime.toFixed( 3 ) }`, this.debugStatsGraph.width / 2 + this.debugStatsGraph.width / 15, this.debugStatsGraph.height / 3, this.debugStatsGraph.width / 10 )
		ctx.closePath();

		if ( !( this.appTime.updateCount % 10 ) ) {
			const maxSavedTimes = Math.round( 2 * this.maximumSavedFrameTimes / 3 );
			if ( this.debugStatsGraphAverages.length > maxSavedTimes ) {
				this.debugStatsGraphAverages.shift();
			}
			this.debugStatsGraphAverages.push( this.appTime.frameTimeAverage );
			ctx.clearRect( 0, 0, this.debugStatsGraph.width / 2 - 1, this.debugStatsGraph.height );
			// Last frame time counter
			const deviation = 0.02;
			const max = _.max( this.debugStatsGraphAverages ),
				min = _.min( this.debugStatsGraphAverages );
			const statistics = {
				spread : max - min,
				maxSpread : max * ( 1 + deviation / 2 ) - min * ( 1 - deviation / 2 ),
				averageValue : _.mean( this.debugStatsGraphAverages ),
				scale : {
					max : max * ( 1 + deviation / 2 ),
					min : min * ( 1 - deviation / 2 ),
				},
			};
			// max
			ctx.beginPath();
			ctx.fillStyle = "#000";
			ctx.font = "12px Roboto";
			ctx.fillText( `${ statistics.scale.max.toFixed( 3 ) }ms`, this.debugStatsGraph.width / 20, this.debugStatsGraph.height / 5, this.debugStatsGraph.width / 20 );
			ctx.closePath();

			// min
			ctx.beginPath();
			ctx.fillStyle = "#000";
			ctx.font = "12px Roboto";
			ctx.fillText( `${ statistics.scale.min.toFixed( 3 ) }ms`, this.debugStatsGraph.width / 20, 4 * this.debugStatsGraph.height / 5, this.debugStatsGraph.width / 20 );
			ctx.closePath();

			// graph border
			ctx.beginPath();
			ctx.strokeStyle = "#000";
			ctx.strokeRect( this.debugStatsGraph.width / 10, this.debugStatsGraph.height / 5,
			                this.debugStatsGraph.width / 3, 3 * this.debugStatsGraph.height / 5 );
			ctx.closePath();

			// average value
			ctx.beginPath()
			ctx.strokeStyle = "#666";
			ctx.moveTo( this.debugStatsGraph.width / 10, ( this.debugStatsGraph.height / 5 + 4 * this.debugStatsGraph.height / 5 ) / 2 );
			ctx.lineTo( this.debugStatsGraph.width / 10 + this.debugStatsGraph.width / 3, ( this.debugStatsGraph.height / 5 + 4 * this.debugStatsGraph.height / 5 ) / 2 );
			ctx.stroke();
			ctx.closePath();

			// average value marker
			ctx.beginPath();
			ctx.fillStyle = "#000";
			ctx.fillText( `${ _.mean( [ statistics.scale.min, statistics.scale.max ] ).toFixed( 3 ) }ms`, this.debugStatsGraph.width / 20, ( this.debugStatsGraph.height / 5 + 4 * this.debugStatsGraph.height / 5 ) / 2, this.debugStatsGraph.width / 20 );
			ctx.closePath();

			const minH = this.debugStatsGraph.height / 5,
				maxH = 3 * ( this.debugStatsGraph.height / 5 );
			const hSpread = maxH - minH;
			const minW = this.debugStatsGraph.width / 10,
				maxW = minW + this.debugStatsGraph.width / 3;
			const wSpread = maxW - minW;

			const getHeight = ( i ) => {
				const mapped = Mathematics.linearMapping( this.debugStatsGraphAverages[ i ], statistics.scale.min, statistics.scale.max );
				return mapped * hSpread;
			}

			for ( let i in this.debugStatsGraphAverages ) {
				ctx.beginPath();
				const height = getHeight( i );
				ctx.fillStyle = "#000";
				ctx.ellipse( maxW - ( Number( i ) * wSpread / maxSavedTimes ), maxH - ( height - minH / 2 ), 1, 1, 0, 0, 2 * Math.PI );
				ctx.fill();
				if ( i ) {
					ctx.strokeStyle = "#000";
					ctx.moveTo( maxW - ( ( Number( i ) - 1 ) * wSpread / maxSavedTimes ), maxH - ( getHeight( Number( i ) - 1 ) - minH / 2 ) )
					ctx.lineTo( maxW - ( Number( i ) * wSpread / maxSavedTimes ), maxH - ( height - minH / 2 ) );
					ctx.stroke();
				}
				ctx.closePath();
			}
		}

	}

	public registerUpdateFunction ( functionPointer : ( ...props : any[] ) => any, ...props : any[] ) {
		this.updateFunctionStack.push( {
			                               f : functionPointer,
			                               props : props,
		                               } );
	}

	public changeLanguage ( newLang : string ) {
		this.language = newLang;
		$.get( `./lang/${this.language}.json`, ( data ) => {
			this.translations = _.merge(data, GlobalTranslations);
			this.translate();
		} );
	}

	public translate () {
		Array.from( $( "*[translate]" ) ).forEach( ( e ) => {
			$( e ).text( this.translations[ $( e ).attr( 'translate' ) ] );
		} );
	}

	public debug ( level : string | string[], debugOptions ? : DebugOptions ) {
		if ( !_.isEmpty( debugOptions ) ) {
			this.debugOptions = debugOptions;
		}
		if ( debugOptions.statsGraph && ( level === 'stats' || level.includes( 'stats' ) ) ) {
			let canvasSize = {
				w : window.innerWidth,
				h : window.innerHeight,
			}
			this.debugStatsGraph = DOMHelper.newElement( 'canvas', {
				props : [
					{
						name : "width",
						value : `${ canvasSize.w }px`,
					},
					{
						name : "height",
						value : `${ canvasSize.h * 0.1 }px`,
					},
				],
				style : `position:fixed;z-index:100000000;background-color: rgba(255,255,255,0.2); bottom: 0; left:0; display: block`,
			} ) as HTMLCanvasElement;
			$( window ).on( 'resize', ( e ) => {
				canvasSize = {
					w : window.innerWidth * ( window.devicePixelRatio || 1 ),
					h : window.innerHeight * ( window.devicePixelRatio || 1 ),
				}
				$( this.debugStatsGraph )
					.attr( 'width', canvasSize.w )
					.attr( 'height', canvasSize.h * 0.1 );
			} )
			$( document.body ).append( this.debugStatsGraph );
		}
	}
}

if ( ( module as any ).hot ) {
	( module as any ).hot.accept();
}
