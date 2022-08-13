import axios from "axios";
import woocommerce from "./woocommerce";

/**
 * @param page
 * @param endpoint
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
const getKlarnaOrderById = async (page, endpoint, id) => {
	const encodedKey = await page.evaluate((auth) => {
		const merchant = process.env.API_KEY;
		const secret = process.env.API_SECRET;
		return btoa(`${merchant}:${secret}`);
	});

	return axios.get(`${endpoint}/${id}`, {
		headers: {
			Authorization: `Basic ${encodedKey}`,
		},
	});
};

const getWCOrderById = async (id) => woocommerce.getOrderById(id);
const createWCCustomer = async (data) => woocommerce.createCustomer(data);
const getWCCustomers = async () => woocommerce.getCustomers();
const clearWCSession = async () => woocommerce.clearSession();
const updateOptions = async (data) => woocommerce.updateOption(data);
const createWCProduct = async (data) => woocommerce.createProduct(data);
const getWCOrders = async () => woocommerce.getOrders();
const getWCProductById = async (id) => woocommerce.getProductById(id);
const pricesIncludeTax = async (data) => woocommerce.pricesIncludeTax(data);
const listTaxRates = async() => woocommerce.listaAllTaxRates()
const createKsaStandardTaxRate = async(data) => woocommerce.ksaCreateStandardTaxRate(data)
const removeStandardTaxRate = async(data, rateId) => woocommerce.ksaDeleteStandardTaxRate(data, rateId)

const showShippingMethods = async() => woocommerce.getAllShippingMethods()
const createShippingMethod = async(data) => woocommerce.createShippingMethod(data)
const deleteShippingMethodById = async (data, id) => woocommerce.deleteShippingMethodById(data, id);

export default {
	getKlarnaOrderById,
	getWCOrderById,
	getWCCustomers,
	createWCCustomer,
	clearWCSession,
	updateOptions,
	createWCProduct,
	getWCOrders,
	getWCProductById,
	pricesIncludeTax,

	showShippingMethods,
	createShippingMethod,
	listTaxRates,
	createKsaStandardTaxRate,
	deleteShippingMethodById,
	removeStandardTaxRate
};
