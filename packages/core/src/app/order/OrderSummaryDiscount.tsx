import React, { FunctionComponent, memo } from 'react';

import { ShopperCurrency } from '../currency';
import { TranslatedString } from '../locale';

import OrderSummaryPrice, { OrderSummaryPriceProps } from './OrderSummaryPrice';

export interface OrderSummaryDiscountProps extends OrderSummaryPriceProps {
    remaining?: number;
    code?: string;
    onRemoved?(code: string): void;
}

const OrderSummaryDiscount: FunctionComponent<OrderSummaryDiscountProps> = ({
    code,
    remaining,
    amount,
    onRemoved,
    ...rest
}) => (
    <OrderSummaryPrice
        {...rest}
        {...(onRemoved && {
            onActionTriggered: () => code && onRemoved(code),
            actionLabel: <TranslatedString id="cart.remove_action" />,
        })}
        amount={-1 * (amount || 0)}
    >
        {!!remaining && remaining > 0 && (
            <span
                className="cart-priceItem-postFix optimizedCheckout-contentSecondary"
                data-test="cart-price-remaining"
            >
                <TranslatedString id="cart.remaining_text" />
                {': '}
                <ShopperCurrency amount={remaining} />
            </span>
        )}
    </OrderSummaryPrice>
);

export default memo(OrderSummaryDiscount);
