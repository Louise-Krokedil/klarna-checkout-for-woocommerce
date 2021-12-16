import { registerPaymentMethod } from '@woocommerce/blocks-registry';
import KCO from './KCO';

const options = {
	name: 'kco',
	content: <KCO />,
	label: <strong>Klarna</strong>,
	ariaLabel: 'kco',
	edit: <KCO />,
	canMakePayment: () => true,
	paymentMethodId: 'kco',
	supports: {
		features: [ 'products' ],
	},
};

registerPaymentMethod( options );