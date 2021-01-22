/**
 * Proprietary Helper library by Adam Opalecký
 * Allows to use most useful functions from jQuery and Lodash within one single file without any need to download any of the two
 * Has bonus helpful functions ranging from Math and Color to String and Array utility
 */

class HelperDOMElement {
	public element : HTMLElement;
	public classArray : string[] = [];
	public id? : string;
	public data : any[] = [];

	constructor ( element : HTMLElement ) {
		this.element = element;
		for ( let c in this.element.classList ) {
			if ( !( c === undefined || c === null ) && this.element.classList.hasOwnProperty( c ) ) {
				this.classArray.push( this.element.classList[ c ] );
			}
		}
		this.id = this.element.getAttribute( 'id' );
		for ( let att in this.element.attributes ) {
			if ( this.element.attributes.hasOwnProperty( att ) && this.element.attributes[ att ].name && this.element.attributes[ att ].name.match( /data-.*/ ) ) {
				const otp = {};
				otp[ this.element.attributes[ att ].name.split( 'data-' )[ 0 ] ] = this.element.attributes[ att ].value;
				this.data.push( otp );
			}
		}
	}


	public addClass ( cl : string | string[] ) {}

	public removeClass ( cl : string | string[] ) {}

	public listen ( eventName : string | Event, callBack ) {}

	public append ( child : any ) {}

	public inner ( child : any ) {}
}

class Color {

}

class Helper {
	// DOM functions
	public static Element ( selector : string | HTMLElement | HTMLElement[] | HTMLDocument | Window ) : HelperDOMElement | HelperDOMElement[] {return new HelperDOMElement(document.createElement('div'));}

	// Logic functions
	public static isEqual ( object1 : any, object2 : any ) : boolean {return false;}

	public static isEmpty ( object : any[] | any ) : boolean {return false;}

	// String function
	public static repeat ( str : string, amount : number ) : string {return '';}

	public static replaceAll ( str : string, search : string | number, replace : string | number ) : string {return '';};

	// Color functions
	public static getRandomColor ( amount? : number ) : Color | Color[] {return new Color()}

	public static getComplimentaryColor ( color : Color, amount? : number ) : Color | Color[] {return new Color()}
}
