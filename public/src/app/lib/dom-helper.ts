import _ from 'lodash';

export type ElementProps = {
	id?: string;
	class?: string[];
	name?: string;
	title?:string;
	data?: {name:string, value:string}[];
	style?: string;
	props?: {name:string, value:string}[];
}

export default class DOMHelper {
	public static newElement(type:string, props?:ElementProps): HTMLElement {
		const otp = document.createElement(type);
		if(!_.isNil(props.id) && !_.isEmpty(props.id)) {
			otp.setAttribute('id', props.id);
		}
		if(!_.isNil(props.class) && !_.isEmpty(props.class)) {
			otp.setAttribute('class', props.class.map((e)=>e.trim()).join(' '));
		}
		if(!_.isNil(props.name) && !_.isEmpty(props.name)) {
			otp.setAttribute('name', props.name);
		}
		if(!_.isNil(props.title) && !_.isEmpty(props.title)) {
			otp.setAttribute('title', props.title);
		}
		if(!_.isNil(props.style) && !_.isEmpty(props.style)) {
			otp.setAttribute('style', props.style);
		}
		if(!_.isNil(props.data) && !_.isEmpty(props.data)) {
			props.data.forEach((e)=>{
				otp.setAttribute(`data-${e.name}`, e.value);
			})
		}
		if(!_.isNil(props.props) && !_.isEmpty(props.props)) {
			props.props.forEach((e)=>{
				otp.setAttribute(e.name, e.value);
			})
		}
		return otp;
	}
}
