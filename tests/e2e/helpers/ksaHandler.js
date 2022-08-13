import orderManagement from '../helpers/orderManagement'
import utils from "../helpers/utils";
import urls from './urls';
import API from '../api/API';
import woocommerce from '../api/woocommerce';

const setShippingMethods = async (page, toggleSwitch) => {


    let taxRatesList = await API.listTaxRates()

    


    await utils.executeCommand(`wp plugin deactivate klarna-shipping-service-for-woocommerce`);

    if (!toggleSwitch) {

        for (let index = 0; index < taxRatesList.data.length; index++) {
            if (taxRatesList.data[index].name === '*' && taxRatesList.data[index].class === 'standard') {
                await API.removeStandardTaxRate({force:true}, taxRatesList.data[index].id)
            }
        }

        let allShippingMethodsList = await woocommerce.getAllShippingMethods()

        for (let index = 0; index < allShippingMethodsList.data.length; index++) {

            if (allShippingMethodsList.data[index].method_id === 'klarna_kss') {
                console.log(allShippingMethodsList.data[index].id);
                await utils.deleteShippingMethod({ force: true }, allShippingMethodsList.data[index].id)
            }
        }


    } else {

        await utils.createKsaTaxRate()

        // Move KSA shipping method to first order
        await utils.executeCommand(`wp plugin activate klarna-shipping-service-for-woocommerce`);
        await utils.addShippingMethod('KSA');

        await page.waitForTimeout(1000);

        let allShippingMethodsListKSA = await woocommerce.getAllShippingMethods()

        for (let index = 0; index < allShippingMethodsListKSA.data.length; index++) {

            if (allShippingMethodsListKSA.data[index].method_id === 'klarna_kss') {

                await woocommerce.updateShippingZoneMethod('1', allShippingMethodsListKSA.data[index].id, {order:1})
                await woocommerce.updateShippingZoneMethod('1', '1', {order:allShippingMethodsListKSA.data[index].id})
            }
            
        }


        await page.waitForTimeout(1000);
    }
}

const setShippingTaxClass = async (page, toggleSwitch) => {


    await page.goto(urls.TAX_SETTINGS)
    await orderManagement.updateWPDB(page)

    await page.waitForTimeout(2000);
    await orderManagement.loginToAdmin(page)


    await page.waitForTimeout(2000);

    if (toggleSwitch) {
        await page.select('#woocommerce_shipping_tax_class', '')
    } else {
        await page.select('#woocommerce_shipping_tax_class', 'inherit')
    }

    await page.waitForTimeout(1000);

    let submitTaxSettings = await page.$('.button-primary.woocommerce-save-button')
    await submitTaxSettings.focus()
    await submitTaxSettings.click()

}


export default {
    setShippingMethods,
    setShippingTaxClass
}