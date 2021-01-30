// styles
import './styles/styles.less';
import {BACKGROUND_TYPES} from "./app/components/background";

// App imports
import App,{AppProps}             from './app/app';

// App settings
const settings = {
	name: 'Adam Opalecký - website',
	dev: {
		on: true,
		maximumSavedFrametimes: 144
	},
} as AppProps;

// App Init
export const app = new App(settings);
app.setBackground(BACKGROUND_TYPES.BUBBLES);
app.debug('stats', {statsGraph: false});

if((module as any).hot) {
	(module as any).hot.accept();
}
