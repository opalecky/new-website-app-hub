import Mathematics from "./mathematics";
import Color       from "./color";

export abstract class Shape2D {
	position : { x : number, y : number, z : number };
	rotation : { x : number, y : number, z : number };
	fillColor : Color;
	strokeColor : Color;
	strokeStrength : number;
	canvas : HTMLCanvasElement;
	ctx : CanvasRenderingContext2D;

	protected constructor ( {
		                        x = 0,
		                        y = 0,
		                        z = 0,
	                        }, fillColor = Color.COLORS.NULL, stroke = {
		strokeColor : Color.COLORS.NULL,
		strokeStrength : 1,
	}, canvas = document.createElement( 'canvas' ) ) {
		this.position = {
			x : x,
			y : y,
			z : z,
		}
		this.rotation = {
			x : 0,
			y : 0,
			z : 0,
		}
		this.fillColor = fillColor;
		this.strokeColor = stroke.strokeColor;
		this.strokeStrength = stroke.strokeStrength;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext( '2d' );
	}

	abstract draw ();

	abstract includesPoint ( point : Point );

	move ( { x = 0, y = 0, z = 0 } ) {
		this.position.x += x;
		this.position.y += y;
		this.position.z += z;
		if ( z === 0 ) {
			return { x : this.position.x, y : this.position.y };
		}
		return { x : this.position.x, y : this.position.y, z : this.position.z };
	}

	rotate ( { x = 0, y = 0, z = 0 }, units = 'rad' ) {
		if ( units !== 'rad' ) {
			x = x * Math.PI / 180;
			y = y * Math.PI / 180;
			z = z * Math.PI / 180;
		}
		this.rotation.x += x;
		this.rotation.y += y;
		this.rotation.z += z;

		return this.rotation;
	}
}

export class Point extends Shape2D {
	constructor ( {
		              position,
		              fillColor = Color.COLORS.NULL,
		              stroke = { strokeColor : Color.COLORS.NULL, strokeStrength : 1 },
		              canvas = document.createElement( 'canvas' ),
	              } ) {
		super( position, fillColor, stroke, canvas );
	}

	draw () {
		( new Circle(
			{
				x : this.position.x,
				y : this.position.y,
			},
			this.fillColor,
			{
				strokeColor : this.strokeColor,
				strokeStrength : this.strokeStrength,
			},
			this.canvas,
			{
				radius : 2,
				anticlosewise : false,
				startAngle : 0,
				endAngle : 360,
			} ) ).draw();
	}

	includesPoint ( point : Point ) {

	}
}

export class NGon extends Shape2D {
	angles : number;
	x : number[];
	y : number[];
	z : number[];

	constructor ( position, fillColor = new Color( '#ffffff' ), stroke = {
		strokeColor : Color.COLORS.NULL,
		strokeStrength : 1,
	}, canvas = document.createElement( 'canvas' ), {
		              angles = 3,
		              x = [ 0, 0, 0 ],
		              y = [ 0, 0, 0 ],
		              z = [ 0, 0, 0 ],
	              } ) {
		super( position, fillColor, stroke, canvas );
		this.x = x;
		this.y = y;
		this.z = z;
		this.angles = angles;
	}

	draw () {
		this.ctx.beginPath();
		this.ctx.moveTo( this.position.x + this.x[ 0 ] / ( this.z[ 0 ] || 1 ), this.position.y + this.y[ 0 ] / ( this.z[ 0 ] || 1 ) );
		for ( let i = 1 ; i < this.angles ; i++ ) {
			this.ctx.lineTo( this.position.x + this.x[ i ] / ( this.z[ i ] || 1 ), this.position.y + this.y[ i ] / ( this.z[ i ] || 1 ) );
		}
		if ( this.fillColor !== Color.COLORS.NULL ) {
			this.ctx.fillStyle = this.fillColor.getCode();
			this.ctx.fill();
		}
		if ( this.strokeColor !== Color.COLORS.NULL ) {
			this.ctx.strokeStyle = this.strokeColor.getCode();
			this.ctx.stroke();
		}
		this.ctx.closePath();
	}

	includesPoint ( point : Point ) {

	}
}

export class ellipse extends Shape2D {
	radiusX : number;
	radiusY : number;
	anticlockwise : boolean;
	startAngle : number;
	endAngle : number;

	constructor ( position, fillColor = new Color( '#ffffff' ), stroke = {
		strokeColor : Color.COLORS.NULL,
		strokeStrength : 1,
	}, canvas = document.createElement( 'canvas' ), {
		              radiusX = 1,
		              radiusY = 1,
		              anticlosewise = false,
		              startAngle = 0,
		              endAngle = 360,
	              } ) {
		super( position, fillColor, stroke, canvas );
		this.radiusX = radiusX;
		this.radiusY = radiusY;
		this.anticlockwise = anticlosewise;
		this.startAngle = startAngle / 180 * Math.PI;
		this.endAngle = endAngle / 180 * Math.PI;
	}

	draw () {
		this.ctx.beginPath();
		this.ctx.ellipse(
			this.position.x,
			this.position.y,
			this.radiusX / ( this.position.z || 1 ),
			this.radiusY / ( this.position.z || 1 ),
			this.rotation.z,
			this.startAngle,
			this.endAngle,
			this.anticlockwise );
		if ( this.fillColor !== Color.COLORS.NULL ) {
			this.ctx.fillStyle = this.fillColor.getCode();
			this.ctx.fill();
		}
		if ( this.strokeColor !== Color.COLORS.NULL ) {
			this.ctx.strokeStyle = this.strokeColor.getCode();
			this.ctx.stroke();
		}
		this.ctx.closePath();
	}

	includesPoint ( point : Point ) {

	}
}

export class Rectangle extends Shape2D {
	width : number;
	height : number;

	constructor ( position, fillColor = new Color( '#ffffff' ), stroke = {
		strokeColor : Color.COLORS.NULL,
		strokeStrength : 1,
	}, canvas = document.createElement( 'canvas' ), { width = 1, height = 1 } ) {
		super( position, fillColor, stroke, canvas );
		this.width = width / ( this.position.z || 1 );
		this.height = height / ( this.position.z || 1 );
	}

	draw () {
		this.ctx.beginPath();
		if ( this.fillColor !== Color.COLORS.NULL ) {
			this.ctx.fillRect( this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.x + this.width / 2, this.position.y + this.height / 2 );
		}
		if ( this.strokeColor !== Color.COLORS.NULL ) {
			this.ctx.strokeRect( this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.x + this.width / 2, this.position.y + this.height / 2 );
		}
		this.ctx.closePath();
	}

	includesPoint ( point : Point ) {
		const isInVertically = point.position.y <= this.position.y + this.height / 2 && point.position.y >= this.position.y - this.height / 2;
		const isInHorizontally = point.position.x <= this.position.x + this.width / 2 && point.position.x >= this.position.x - this.width / 2;
		return isInHorizontally && isInVertically;
	}
}

export class Square extends Rectangle {
	constructor ( position, fillColor = new Color( '#ffffff' ), stroke = {
		strokeColor : Color.COLORS.NULL,
		strokeStrength : 1,
	}, canvas = document.createElement( 'canvas' ), width = 1 ) {
		super( position, fillColor, stroke, canvas, { width : width, height : width } );
	}

	draw () {
		super.draw();
	}

	includesPoint ( point : Point ) {
		return super.includesPoint( point );
	}
}

export class Circle extends ellipse {
	constructor ( position, fillColor = new Color( '#ffffff' ), stroke = {
		strokeColor : Color.COLORS.NULL,
		strokeStrength : 1,
	}, canvas = document.createElement( 'canvas' ), {
		              radius = 1,
		              anticlosewise = false,
		              startAngle = 0,
		              endAngle = 360,
	              } ) {
		super( position, fillColor, stroke, canvas, {
			radiusX : radius,
			radiusY : radius,
			startAngle : startAngle,
			endAngle : endAngle,
			anticlosewise : anticlosewise,
		} );
	}

	draw () {
		super.draw();
	}

	includesPoint ( point : Point ) {
		return Mathematics.pythagoras( [ point.position.x, point.position.y ] ) <= this.radiusX;
	}
}
