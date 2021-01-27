// styles
import './styles/styles.less';

// App imports
import App,{AppProps}             from './app/app';

// App settings
const settings = {
	name: 'Adam Opalecký - website',
	dev: {
		on: false,
		maximumSavedFrametimes: 144
	}, //todo: remove
} as AppProps;

// App Init
export const app = new App(settings);
//app.debug('stats', {statsGraph: true});

