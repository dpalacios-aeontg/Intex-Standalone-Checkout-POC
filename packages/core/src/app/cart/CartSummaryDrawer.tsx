import { FunctionComponent, memo } from 'react';

import { withCheckout } from '../checkout';
import OrderSummaryDrawer from '../order/OrderSummaryDrawer';

import { WithCheckoutCartSummaryProps } from './CartSummary';
import mapToCartSummaryProps from './mapToCartSummaryProps';
import withRedeemable from './withRedeemable';

const CartSummaryDrawer: FunctionComponent<WithCheckoutCartSummaryProps> = ({
    cartUrl,
    ...props
}) =>
    withRedeemable(OrderSummaryDrawer)({
        ...props,
        cartUrl
    });

export default withCheckout(mapToCartSummaryProps)(memo(CartSummaryDrawer));
