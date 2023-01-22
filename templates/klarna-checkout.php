<?php
/**
 * Klarna Checkout page
 *
 * Overrides /checkout/form-checkout.php.
 *
 * @package klarna-checkout-for-woocommerce
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$checkout = isset( $checkout ) ? $checkout : WC()->checkout();

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and not logged in, the user cannot checkout.
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}

$settings = get_option( 'woocommerce_kco_settings' );
?>

<style>
.wc_payment_methods.payment_methods.methods,
.woocommerce-terms-and-conditions-wrapper,
#payment .place-order .button {
	display: none;
}
.kco-wc-form {
	position: absolute;
	top: -9999px;
	left: -9999px;
}

</style>

<form name="checkout" method="post" class="checkout woocommerce-checkout kco-checkout"
	action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">
	<div id="kco-wrapper">

		<!-- These are the standard WC form fields. -->
		<?php if ( $checkout->get_checkout_fields() ) : ?>
		<div class='kco-wc-form'>
			<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>
			<div class="col2-set" id="customer_details">
				<div class="col-1"></div>
				<?php do_action( 'woocommerce_checkout_billing' ); ?>
			</div>
			<div class="col-2">
				<?php do_action( 'woocommerce_checkout_shipping' ); ?>
			</div>

			<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>
		</div>

		<?php endif; ?>

		<?php do_action( 'woocommerce_checkout_before_order_review_heading' ); ?>
		<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>

		<div id="kco-order-review" class="woocommerce-checkout-review-order">
			<?php do_action( 'woocommerce_checkout_order_review' ); ?>
		</div>
		<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>
		
		<div id="kco-iframe">
			<?php kco_wc_show_snippet(); ?>
		</div>
	</div>
</form>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
