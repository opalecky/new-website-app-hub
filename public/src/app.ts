// styles
import './styles/styles.less';

// App imports
import App,{AppProps}             from './app/app';

// App settings
const settings = {
	name: 'Adam Opalecký - website',
	dev: true, //todo: remove
} as AppProps;

// App Init
new App(settings);
