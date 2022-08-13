const BASE_URL = "http://localhost:8000";

const API_BASE_URL = `${BASE_URL}/wp-json`;

const CHECKOUT = `${BASE_URL}/checkout`;

const SHOP = `${BASE_URL}/shop`;

const ORDER = `${BASE_URL}/wp-admin/edit.php?post_type=shop_order`;

const ADMIN = `${BASE_URL}/wp-admin`;

const ADD_TO_CART = `${BASE_URL}/shop/?add-to-cart=`;

const MY_ACCOUNT = `${BASE_URL}/my-account`;

const API_ORDER_ENDPOINT = "/wc/v3/orders/";

const API_PRODUCTS_ENDPOINT = "/wc/v3/products/";

const API_COUPON_ENDPOINT = "/wc/v3/coupons/";

const API_TAXES_ENDPOINT = "/wc/v3/taxes/";

const API_SHIPPING_ENDPOINT = "/wc/v3/shipping/";

const API_CUSTOMER_ENDPOINT = "/wc/v3/customers";

const API_WC_PRICE_INC_EXC =
	"/wc/v3/settings/tax/woocommerce_prices_include_tax";

const API_SESSION_ENDPOINT = "/wc/v3/system_status/tools/clear_sessions";

const API_WC_OPTIONS = "/wc-admin/options";

const API_SHIPPING_METHOD_LIST_ALL = "/wc/v3/shipping/zones/1/methods";

const API_SHIPPING_METHOD_CREATE = "/wc/v3/shipping/zones/1/methods";

const API_SHIPPING_METHODS_REMOVE_METHOD = "/wc/v3/shipping/zones/1/methods"

const API_CREATE_TAX_RATE = "/wc/v3/taxes"

const TAX_SETTINGS = `${BASE_URL}/wp-admin/admin.php?page=wc-settings&tab=tax`

const SHIPPING_ZONE_METHODS = `${BASE_URL}/wp-admin/admin.php?page=wc-settings&tab=shipping&zone_id=1`;

export default {
	BASE_URL,
	CHECKOUT,
	SHOP,
	ADD_TO_CART,
	MY_ACCOUNT,
	API_BASE_URL,
	API_ORDER_ENDPOINT,
	API_PRODUCTS_ENDPOINT,
	API_COUPON_ENDPOINT,
	API_TAXES_ENDPOINT,
	API_SHIPPING_ENDPOINT,
	API_CUSTOMER_ENDPOINT,
	API_SESSION_ENDPOINT,
	API_WC_OPTIONS,
	API_WC_PRICE_INC_EXC,
	ORDER,
	ADMIN,
	API_SHIPPING_METHOD_LIST_ALL,
	API_SHIPPING_METHOD_CREATE,
	API_SHIPPING_METHODS_REMOVE_METHOD,
	API_CREATE_TAX_RATE,
	SHIPPING_ZONE_METHODS,
	TAX_SETTINGS
};
