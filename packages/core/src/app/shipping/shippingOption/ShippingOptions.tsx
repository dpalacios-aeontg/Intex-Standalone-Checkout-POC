import { Cart, CheckoutSelectors, Consignment } from '@bigcommerce/checkout-sdk';
import { map, sortBy, uniq } from 'lodash';
import { createSelector } from 'reselect';

import { CheckoutContextProps, withCheckout } from '../../checkout';
import getShippableLineItems from '../getShippableLineItems';
import getShippingMethodId from '../getShippingMethodId';

import ShippingOptionsForm from './ShippingOptionsForm';

export interface ShippingOptionsProps {
    isMultiShippingMode: boolean;
    isUpdatingAddress?: boolean;
    shouldShowShippingOptions: boolean;
}

export interface WithCheckoutShippingOptionsProps {
    invalidShippingMessage: string;
    methodId?: string;
    consignments?: Consignment[];
    cart: Cart;
    isSelectingShippingOption(consignmentId?: string): boolean;
    subscribeToConsignments(subscriber: (state: CheckoutSelectors) => void): () => void;
    selectShippingOption(consignmentId: string, optionId: string): Promise<CheckoutSelectors>;
    isLoading(consignmentId?: string): boolean;
}

const subscribeToConsignmentsSelector = createSelector(
    ({ checkoutService }: CheckoutContextProps) => checkoutService.subscribe,
    (subscribe) => (subscriber: (state: CheckoutSelectors) => void) => {
        return subscribe(subscriber, ({ data }) => data.getConsignments());
    },
);

const isLoadingSelector = createSelector(
    (_: CheckoutSelectors, { isUpdatingAddress }: ShippingOptionsProps) => isUpdatingAddress,
    ({ statuses }: CheckoutSelectors) => statuses.isLoadingShippingOptions,
    ({ statuses }: CheckoutSelectors) => statuses.isSelectingShippingOption,
    ({ statuses }: CheckoutSelectors) => statuses.isUpdatingConsignment,
    ({ statuses }: CheckoutSelectors) => statuses.isCreatingConsignments,
    (
        isUpdatingAddress,
        isLoadingShippingOptions,
        isSelectingShippingOption,
        isUpdatingConsignment,
        isCreatingConsignments,
    ) => {
        return (consignmentId?: string) => {
            return (
                isUpdatingAddress ||
                isLoadingShippingOptions() ||
                isSelectingShippingOption(consignmentId) ||
                isUpdatingConsignment(consignmentId) ||
                isCreatingConsignments()
            );
        };
    },
);

const sortConsignments = (cart: Cart, unsortedConsignments: Consignment[]): Consignment[] => {
    if (unsortedConsignments.length < 2) {
        return unsortedConsignments;
    }

    const shippableItems = getShippableLineItems(cart, unsortedConsignments);
    const consignmentsOrder = uniq(map(shippableItems, 'consignment.id'));

    return sortBy(unsortedConsignments, (consignment: any) => consignmentsOrder.indexOf(consignment.id));
};



export function mapToShippingOptions(
    { checkoutService, checkoutState }: CheckoutContextProps,
    props: ShippingOptionsProps,
): WithCheckoutShippingOptionsProps | null {
    const {
        data: { getCart, getConsignments, getConfig, getCustomer, getCheckout },
        statuses: { isSelectingShippingOption },
    } = checkoutState;

    const customer = getCustomer();
    const cart = getCart();
    const config = getConfig();
    const checkout = getCheckout();

    if (!config || !checkout || !customer || !cart) {
        return null;
    }

    const consignments = sortConsignments(cart, getConsignments() || []);
    const methodId = getShippingMethodId(checkout);
    const { shippingQuoteFailedMessage } = config.checkoutSettings;

    if(consignments?.length && !!consignments[0])
    {
        const { availableShippingOptions } = consignments[0];

        if(availableShippingOptions?.length)
        {
            const expressShipping = availableShippingOptions.find( option => option.description === 'FedEx (FedEx Express Saver)' );
            const standardShipping = availableShippingOptions.find( option => option.description === 'FedEx (Ground Home Delivery)' );

            if(expressShipping && standardShipping)
            {
                const delta = Math.ceil((expressShipping.cost - standardShipping.cost) * 100) / 100; // Round to nearest hundredth
                // Create coupon

                const { coupons, id: cartId } = cart;
                let count = 0;

                if(count < 1){
                    if(!coupons?.length)
                    {
                        count++;

                        (async () => {
                            await fetch('https://uox63mtruzhalf2xznkjsri63i0eukwc.lambda-url.us-west-1.on.aws', {
                                method: 'POST',
                                mode: 'cors',
                                body: JSON.stringify({
                                    cartId,
                                    shippingRateDelta: delta
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if(data?.code?.length){
                                    checkoutService.applyCoupon(data.code)
                                }
                            });
                        })()
                    }
                    else
                    {
                        const existingCoupon = coupons.find(coupon => coupon.code === cartId);

                        if(existingCoupon)
                        {
                            if(existingCoupon.discountedAmount.toFixed(4) !== delta.toFixed(4))
                            {
                                count++;

                                ( async() => {
                                    checkoutService.removeCoupon(cartId);
                                    await fetch('https://uox63mtruzhalf2xznkjsri63i0eukwc.lambda-url.us-west-1.on.aws', {
                                        method: 'POST',
                                        mode: 'cors',
                                        body: JSON.stringify({
                                            cartId,
                                            shippingRateDelta: delta
                                        })
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if(data?.code?.length){
                                            checkoutService.applyCoupon(data.code)
                                        }
                                    });
                                })()
                            }
                        }
                    }
                }
            }
        }
    }

    return {
        cart,
        consignments,
        invalidShippingMessage: shippingQuoteFailedMessage,
        isLoading: isLoadingSelector(checkoutState, props),
        isSelectingShippingOption,
        methodId,
        selectShippingOption: checkoutService.selectConsignmentShippingOption,
        subscribeToConsignments: subscribeToConsignmentsSelector({
            checkoutService,
            checkoutState,
        }),
    };
}

export default withCheckout(mapToShippingOptions)(ShippingOptionsForm);
