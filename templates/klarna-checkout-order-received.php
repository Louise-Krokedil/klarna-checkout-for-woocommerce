<?php
/**
 * Klarna Checkout fallback order received page, used when WC checkout form submission fails.
 *
 * Overrides /checkout/thankyou.php.
 *
 * @package klarna-checkout-for-woocommerce
 */

if ( ! WC()->session->get( 'kco_wc_order_id' ) ) {
	return;
}

wc_empty_cart();
?>
	<script>sessionStorage.orderSubmitted = false</script>
<?php
kco_wc_show_snippet();
