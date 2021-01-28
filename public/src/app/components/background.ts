import _ from "lodash";
import Mathematics from "../lib/mathematics";
import type App from "../app";

import Color from '../lib/color';

import { Circle, Shape2D, Point } from '../lib/geometry';

const canvas = $( "#background canvas" )[ 0 ] as HTMLCanvasElement;
const ctx = canvas.getContext( '2d' );
$( window ).on( 'resize', () => {
	$( canvas ).attr( 'width', window.innerWidth ).attr( 'height', window.innerHeight );
} );

export enum BACKGROUND_TYPES {
	BUBBLES,
	LINES,
	CONNECTEDDOTS,
	FACEMIMIC,
	TERRAIN,
	SNOW
}

export type BackgroundParticle = {
	shape : Shape2D,
	movement : number[]
}

export type BackgroundSettings = {
	particleCount? : number;
	particleSize? : {
		variable : boolean;
		min : number;
		max? : number
	}
	fillColor? : Color;
	stroke? : {
		color? : Color;
		strength? : number;
	};
	maxSpeed? : {
		x : number;
		y : number;
		z? : number;
	};
	bounce? : boolean;
	particlesInteract? : boolean;
}

const DEFAULT_BACKGROUND_SETTINGS = {
	particleCount : 100,
	particleSize : {
		variable : false,
		min : 10,
	},
	fillColor : _.cloneDeep( Color.COLORS.WHITE ).setOpacity( 0.02 ),
	stroke : {
		color : _.cloneDeep( Color.COLORS.WHITE ).setOpacity( 0.3 ),
		strength : 1,
	},
	maxSpeed : {
		x : 250, // pixels per second
		y : 250,
	},
	bounce : true,
	particlesInteract : false,
}


export type BackgroundProps = {
	app : App;
	type? : number;
}

export default class Background {
	private app : App;
	private type : number = BACKGROUND_TYPES.CONNECTEDDOTS;
	private settings : BackgroundSettings = DEFAULT_BACKGROUND_SETTINGS;
	private particles = [];

	constructor ( props : BackgroundProps ) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		this.app = props.app;
		this.type = props.type;
		this.app.registerUpdateFunction( this.draw.bind( this ) );
		this.initBubbles();
	}

	public static generateBackground ( props ) {
		return new Background( props );
	}

	public draw () {
		this.drawBubbles();
	}

	public setSettings ( newSettings : BackgroundSettings ) {

	}

	initBubbles () {
		for ( let i = 0 ; i < this.settings.particleCount ; i++ ) {
			let x = Math.round( Math.random() * ( window.innerWidth - 100 ) + 50 );
			let y = Math.round( Math.random() * ( window.innerHeight - 100 ) + 50 );
			this.particles.push( {
				                     shape : new Circle( {
					                                         x : x,
					                                         y : y,
					                                         z : 0,
				                                         }, this.settings.fillColor, {
					                                         strokeColor : this.settings.stroke.color,
					                                         strokeStrength : this.settings.stroke.strength,
				                                         }, canvas, { radius : 25 } ),
				                     movement : [ Math.random() * this.settings.maxSpeed.x - this.settings.maxSpeed.x / 2,
				                                  Math.random() * this.settings.maxSpeed.y - this.settings.maxSpeed.y / 2,
				                                  0 ],
			                     } )
		}
	}

	drawBubbles () {
		this.clearCanvas();
		this.particles.forEach( e => {
			const temp = {
				x : e.shape.position.x + e.movement[ 0 ] * this.app.appTime.lastFrameTime / 1000,
				y : e.shape.position.y + e.movement[ 1 ] * this.app.appTime.lastFrameTime / 1000,
				z : e.shape.position.z + e.movement[ 2 ] * this.app.appTime.lastFrameTime / 1000,
			}

			const particleHits = {
				l : e.shape.position.x <= e.shape.radiusX,
				r : e.shape.position.x >= canvas.width - e.shape.radiusX,
				t : e.shape.position.y <= e.shape.radiusX,
				b : e.shape.position.y >= canvas.height - e.shape.radiusY,
			};

			if ( particleHits.t ) {
				temp.y = e.shape.radiusY + 1;
				e.movement[ 1 ] *= -1;
			}

			if ( particleHits.l ) {
				e.movement[ 0 ] *= -1;
				temp.x = e.shape.radiusX + 1;
			}

			if ( particleHits.b ) {
				e.movement[ 1 ] *= -1;
				temp.y = canvas.height - e.shape.radiusY - 1;
			}

			if ( particleHits.r ) {
				e.movement[ 0 ] *= -1;
				temp.x = canvas.width - e.shape.radiusX - 1;
			}

			e.shape.position.x = temp.x;
			e.shape.position.y = temp.y;
			e.shape.position.z = temp.z;

			e.shape.draw();
		} );
	}

	clearCanvas () {
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
	}

}
