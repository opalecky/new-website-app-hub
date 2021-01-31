import App from '../app';

export default abstract class ComponentAbstract {
	public selector : string;
	private constructor () {
		this.register();
	}

	abstract init(): any;

	abstract draw () : boolean | Promise<boolean>;
	register() {
		App.registerComponent(this);
	}
}
