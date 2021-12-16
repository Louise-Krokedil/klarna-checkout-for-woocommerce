import React, { Component } from 'react';
import { getSetting } from '@woocommerce/settings';
import $ from 'jquery';
import isoConverter from './isoConverter';
import useCheckoutAddress from '@woocommerce/base-context/hooks/use-checkout-address';

class KCO extends Component {
	constructor(props) {
        super(props)
		console.log(this.props);
		this.state = {
			billing: props.billing,
			shippingData: props.shippingData,
			onSubmit: props.onSubmit,
			checkoutStatus: props.checkoutStatus,
			iframeLoaded: false,
			options: this.getKCOOptions(),
			callback: null
		}
    }

	setCallback = (callback) => {
		this.setState({callback: callback});
	}

	triggerCallback = (bool) => {
		if (this.state.callback) {
			this.state.callback({should_proceed: bool});
		}
	}

	getKCOOptions = () => {
		const kcoServerData = getSetting( 'kco_data', null );
		if ( ! kcoServerData ) {
			throw new Error(
				__(
					'KCO initialization data is not available',
					'klarna-checkout-for-woocommerce'
				)
			);
		}
		return kcoServerData;
	};
	
	setIframeLoaded = () => {
		this.setState({iframeLoaded: true})
	}	

	updateBilling = (billing) => {
		const newBilling = {...billing};
		this.setState({billing: newBilling});
	}

	updateShipping = (shippingData) => {
		const newShipping = {...shippingData};
		this.setState({shippingData: newShipping});
	}

	renderCheckoutSnippet = () => {
		const checkoutContainer = document.querySelector( '#kco-iframe' );
		if ( checkoutContainer ) {
			checkoutContainer.innerHTML = this.state.options.snippetKCO;
			// This is necessary otherwise the scripts tags are not going to be evaluated
			checkoutContainer.querySelectorAll( 'script' ).forEach( ( script ) => {
				const parentNode = script.parentNode;
				const newScript = document.createElement( 'script' );
				newScript.type = 'text/javascript';
				newScript.text = script.text;
				parentNode.removeChild( script );
				parentNode.appendChild( newScript );
			} );
			return true;
		}
		return false;
	};

	loadIframe = () => {
		if ( ! this.state.iframeLoaded ) {
			const loaded = this.renderCheckoutSnippet();
			if ( loaded === true ) {
				this.setIframeLoaded();
			}
		}
	}

	componentDidMount = () => {
		this.loadIframe();
		this.addListeners();
	}

	componentDidUpdate = () => {
		if(this.props.paymentStatus.isSuccessful) {
			this.triggerCallback(true);
			this.setCallback(null);
		}

		if(this.props.paymentStatus.hasError) {
			this.triggerCallback(false);
			this.setCallback(null);
		}
		
		if(this.props.paymentStatus.hasfailed) {
			this.triggerCallback(false);
			this.setCallback(null);
		}
	}

	getKlarnaOrder = () => {
		let tmpBilling = this.state.billing;
		let tmpShippingData = this.state.shippingData;
		console.log(tmpShippingData);
		const updateBilling = this.updateBilling;
		const updateShipping = this.updateShipping;

		return $.ajax( {
			type: 'POST',
			url: this.state.options.getKlarnaOrderUrl,
			data: {
				nonce: this.state.options.getKlarnaOrderNonce,
			},
			dataType: 'json',
			success( data ) {
				if(data.success){
					if(data.data.billing_address){
						const billing_address = data.data.billing_address;
						const billing = {
							first_name: billing_address.given_name ? billing_address.given_name : '',
							last_name: billing_address.family_name ? billing_address.family_name : '',
							company: billing_address.organization_name ? billing_address.organization_name : '',
							address_1: billing_address.street_address ? billing_address.street_address : '',
							address_2: billing_address.street_address2 ? billing_address.street_address2 : '',
							city: billing_address.city ? billing_address.city : '',
							state: billing_address.region ? billing_address.region : '',
							postcode: billing_address.postal_code ? billing_address.postal_code : '',
							country: billing_address.country ? billing_address.country.toUpperCase() : '',
							phone: billing_address.phone ? billing_address.phone : '',
							email: billing_address.email ? billing_address.email : '',
						}
						
						tmpBilling.billingData = billing;
						updateBilling(tmpBilling);
					}
					if(data.data.shipping_address){
						const shipping_address = data.data.shipping_address;
						const shipping = {
							first_name:shipping_address.given_name ? shipping_address.given_name : '',
							last_name: shipping_address.family_name ? shipping_address.family_name : '',
							company: shipping_address.organization_name ? shipping_address.organization_name : '',
							address_1: shipping_address.street_address ? shipping_address.street_address : '',
							address_2: shipping_address.street_address2 ? shipping_address.street_address2 : '',
							city: shipping_address.city ? shipping_address.city : '',
							state: shipping_address.region ? shipping_address.region : '',
							postcode: shipping_address.postal_code ? shipping_address.postal_code : '',
							country: shipping_address.country ? shipping_address.country.toUpperCase() : '',
							phone: shipping_address.phone ? shipping_address.phone : '',
							email: shipping_address.email ? shipping_address.email : '',
						}

						//tmpShippingData.shippingAddress = shipping;
						//updateShipping(tmpShippingData);
						tmpShippingData.setShippingAddress(shipping);
					}
				}
			},
			error( data ) {
			},
			complete( data ) {},
		} );
	}

	placeKlarnaOrder = () => {
		this.getKlarnaOrder().done( ( response ) => {
			if ( response.success ) {
				// Get the place order button and submit the form
				const btn = document.querySelector(
					'.components-button.wc-block-components-button.wc-block-components-checkout-place-order-button'
				);
				btn.click();
			}
		} );
	}

	addListeners = () => {
		const shippingData = this.state.shippingData;
		const placeKlarnaOrder = this.placeKlarnaOrder;
		const setCallback = this.setCallback;
		if ( typeof window._klarnaCheckout === 'function' ) {
			window._klarnaCheckout( function ( api ) {
				api.on( {
					change(data) {
					},
					order_total_change(data) {
					},
					shipping_option_change(data) {
						shippingData.setSelectedRates(data.id, 0)
					},
					shipping_address_change(data) {
						const address = {
							first_name: data.given_name ? data.given_name : shippingData.shippingAddress.first_name,
							last_name: data.family_name ? data.family_name : shippingData.shippingAddress.last_name,
							company: data.organization_name ? data.organization_name : shippingData.shippingAddress.company,
							address_1: data.street_address ? data.street_address : shippingData.shippingAddress.address_1,
							address_2: data.street_address2 ? data.street_address2 : shippingData.shippingAddress.address_2,
							city: data.city ? data.city : shippingData.shippingAddress.city,
							state: data.region ? data.region : shippingData.shippingAddress.state,
							postcode: data.postal_code ? data.postal_code : shippingData.shippingAddress.postcode,
							country: data.country ? isoConverter(data.country.toUpperCase()) : shippingData.shippingAddress.country,
							phone: data.phone ? data.phone : shippingData.shippingAddress.phone,
						}

						shippingData.setShippingAddress(address);
					},
					validation_callback(data, callback) {
						setCallback(callback);
						placeKlarnaOrder();
					},
					can_not_complete_order(data) {
					}
				} );
			} );
		}
	}

	render = () => {
		return (
			<div id="kco-iframe" />
		);
	}
}

export default KCO;