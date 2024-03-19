import colors from './colors';
import LocalStorage from '@/services/local-storage';

export default {
	shadows: {
		md: '0 0.9rem 3.4rem -0.4rem rgba(0, 0, 0, 0.05)',
	},
	colors,
	config: {
		initialColorMode: LocalStorage.get('chakra-ui-color-mode') || 'system',
		useSystemColorMode: false,
	},
};
