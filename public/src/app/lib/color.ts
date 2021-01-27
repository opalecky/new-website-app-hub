import _ from "lodash";

export default class Color {
	rgba : number[];
	r : number;
	g : number;
	b : number;
	a : number;
	public static COLORS = {
		NULL : new Color( null ),
		RED : new Color( '#f00' ),
		GREEN : new Color( '#0f0' ),
		BLUE : new Color( '#00f' ),
		YELLOW : new Color( '#ff0' ),
		ORANGE : new Color( '#f60' ),
		MAGENTA : new Color( '#f0f' ),
		CYAN : new Color( '#0ff' ),
		WHITE : new Color( '#fff' ),
		BLACK : new Color( '#000' ),
		GRAY : new Color( '#666' ),
		DARKGRAY : new Color( '#272727' ),
		LIGHTGRAY : new Color( '#ccc' ),
	}
	public static frequencyMap = [
		Color.COLORS.RED, //350-
		Color.COLORS.MAGENTA, // 400
		Color.COLORS.BLUE, // 450
		Color.COLORS.CYAN, // 500
		Color.COLORS.GREEN, // 550
		Color.COLORS.YELLOW, // 600
		Color.COLORS.ORANGE, // 650
		Color.COLORS.RED, //700+
	]

	constructor ( settings : any ) {
		if ( settings === null ) {
			return {} as any;
		}
		if ( typeof settings === 'string' ) {
			const hex = settings.match( /#[0-9A-Fa-f]{1,8}/g );
			const rgba = settings.match( /rgba\(\d*,[ ]*\d*,[ ]*\d*,.*\)/g );
			if ( hex ) {
				const vals = hex[ 0 ].match( /[0-9A-Fa-f]/g );
				if ( vals.length === 5 || vals.length === 7 ) return;
				let r : number, g : number, b : number, a : null | number = null, n : number;
				switch ( vals.length ) {
					case 1:
						n = parseInt( `0${ vals[ 0 ] }`, 16 );
						r = n;
						g = n;
						b = n;
						break;
					case 2:
						n = parseInt( `${ vals[ 0 ] }${ vals[ 1 ] }`, 16 );
						r = n;
						g = n;
						b = n;
						break;
					case 3:
						r = parseInt( `${ vals[ 0 ] }${ vals[ 0 ] }`, 16 );
						g = parseInt( `${ vals[ 1 ] }${ vals[ 1 ] }`, 16 );
						b = parseInt( `${ vals[ 2 ] }${ vals[ 2 ] }`, 16 );
						break;
					case 4:
						r = parseInt( `${ vals[ 0 ] }${ vals[ 0 ] }`, 16 );
						g = parseInt( `${ vals[ 1 ] }${ vals[ 1 ] }`, 16 );
						b = parseInt( `${ vals[ 2 ] }${ vals[ 2 ] }`, 16 );
						a = parseInt( `${ vals[ 3 ] }${ vals[ 3 ] }`, 16 ) / 255;
						break;
					case 6:
						r = parseInt( `${ vals[ 0 ] }${ vals[ 1 ] }`, 16 );
						g = parseInt( `${ vals[ 2 ] }${ vals[ 3 ] }`, 16 );
						b = parseInt( `${ vals[ 4 ] }${ vals[ 5 ] }`, 16 );
						break;
					case 8:
						r = parseInt( `${ vals[ 0 ] }${ vals[ 1 ] }`, 16 );
						g = parseInt( `${ vals[ 2 ] }${ vals[ 3 ] }`, 16 );
						b = parseInt( `${ vals[ 4 ] }${ vals[ 5 ] }`, 16 );
						a = parseInt( `${ vals[ 6 ] }${ vals[ 7 ] }`, 16 );
						break;
				}
				this.r = r;
				this.g = g;
				this.b = b;
				this.a = a ?? 1;
			} else if ( rgba ) {
				const val = settings.match( /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/g );
				this.r = Number( val[ 0 ] );
				this.g = Number( val[ 1 ] );
				this.b = Number( val[ 2 ] );
				this.a = Number( val[ 3 ] );
			}
		} else if ( !_.isNil( settings.r ) && !_.isNil( settings.g ) && !_.isNil( settings.b ) ) {
			this.r = settings.r;
			this.g = settings.g;
			this.b = settings.b;
			this.a = _.isNil( settings.a ) ? 1 : settings.a;
		}
	}

	static getRandomColor ( amount = 1 ) {
		if ( amount > 1 ) {
			const otp = [];
			for ( let i = 0 ; i < amount ; i++ ) {
				otp.push( new Color( {
					                     r : Math.round( Math.random() * 255 ),
					                     g : Math.round( Math.random() * 255 ),
					                     b : Math.round( Math.random() * 255 ),
					                     a : 1,
				                     } ) );
			}
			return otp;
		}
		return new Color( {
			                  r : Math.round( Math.random() * 255 ),
			                  g : Math.round( Math.random() * 255 ),
			                  b : Math.round( Math.random() * 255 ),
			                  a : 1,
		                  } );
	}

	static parseHSV ( hue = 0, saturation = 100, value = 100 ) {
		const normalizedHue = hue / 100 * 6;
		const ceilColor = Color.frequencyMap[ Math.ceil( normalizedHue ) ];
		const floorColor = Color.frequencyMap[ Math.floor( normalizedHue ) ];
		const interpolationValue = normalizedHue - Math.floor( normalizedHue );
		let r = Math.round( interpolationValue * ( ceilColor.r - floorColor.r ) + floorColor.r );
		let g = Math.round( interpolationValue * ( ceilColor.g - floorColor.g ) + floorColor.g );
		let b = Math.round( interpolationValue * ( ceilColor.b - floorColor.b ) + floorColor.b );
		const normalSaturation = saturation / 100;
		const mappedSaturation = Math.round( normalSaturation * 255 / 2 );
		const mappedValue = Math.round( value / 100 * 255 );
		let bottomSpread = Math.round( ( mappedValue - mappedSaturation ) * value / 100 );
		let topSpread = Math.round( ( mappedValue + mappedSaturation ) * value / 100 );
		if ( bottomSpread < 0 ) bottomSpread = 0;
		if ( topSpread > 255 ) topSpread = 255;
		const normalR = r / 255;
		const normalG = g / 255;
		const normalB = b / 255;
		r = Math.round( normalR * ( normalSaturation ) * topSpread ) + bottomSpread;
		g = Math.round( normalG * ( normalSaturation ) * topSpread ) + bottomSpread;
		b = Math.round( normalB * ( normalSaturation ) * topSpread ) + bottomSpread;
		if ( r > 255 ) r = 255;
		if ( r < 0 ) r = 0;
		if ( g > 255 ) g = 255;
		if ( g < 0 ) g = 0;
		if ( b > 255 ) b = 255;
		if ( b < 0 ) b = 0;
		return new Color( { r : r, g : g, b : b } );
	}

	static getGradient ( color1 = Color.COLORS.NULL, color2 = Color.COLORS.NULL, subsampling = 3 ) {
		const out = [];
		for ( let i = 0 ; i < subsampling ; i++ ) {
			const per = ( subsampling - i ) / subsampling;
			const colors = [
				Math.round( per * ( color2.r - color1.r ) + color1.r ),
				Math.round( per * ( color2.g - color1.g ) + color1.g ),
				Math.round( per * ( color2.b - color1.b ) + color1.b ),
				Math.round( per * ( color2.a - color1.a ) + color1.a ),
			];
			colors.forEach( ( e, i ) => {
				colors[ i ] = isNaN( e ) ? 0 : e === Infinity ? 255 : e;
			} )
			out.push( new Color( { r : colors[ 0 ], g : colors[ 1 ], b : colors[ 2 ], a : colors[ 3 ] } ) );
		}
		return out;
	}

	getCode () {
		let r = this.r.toString( 16 );
		let g = this.g.toString( 16 );
		let b = this.b.toString( 16 );

		const zero = '0';
		const rL = 2 - r.length;
		const gL = 2 - g.length;
		const bL = 2 - b.length;

		if ( this.a !== 1 ) {
			let a = Math.round( this.a * 255 ).toString( 16 );
			const aL = 2 - a.length;
			return `#${ zero.repeat( rL ) + r }${ zero.repeat( gL ) + g }${ zero.repeat( bL ) + b }${ zero.repeat( aL ) + a }`;
		}
		return `#${ zero.repeat( rL ) + r }${ zero.repeat( gL ) + g }${ zero.repeat( bL ) + b }`;

	}

	getRGBA () {
		return {
			r : this.r,
			g : this.g,
			b : this.b,
			a : this.a,
		}
	}

	setOpacity ( newOpacity : number ) {
		this.a = newOpacity;
		return this;
	}

	async getName () {
		let resp = new Promise( ( resolve ) => {
			const req = new XMLHttpRequest();
			const code = this.getCode().replace( '#', '' ).toUpperCase();
			const url = `https://www.thecolorapi.com/id?hex=${ code }`;
			req.open( 'GET', url );
			req.onreadystatechange = () => {
				resolve( JSON.parse( req.responseText ).name.value );
			};
			req.send();
		} );
		return await resp;
	}
}
