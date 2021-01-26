export default class Mathematics {
	public static squaredSum(numbers:number[]) {
		let otp=0;
		for(const n of numbers) {
			otp+=n*n;
		}
		return otp;
	}
	public static pythagoras(distances:number[]) {
		return Math.pow(Mathematics.squaredSum(distances),1/distances.length);
	}
	public static linearMapping(value, min, max) {
		return (value-min)/(max-min);
	}
}
