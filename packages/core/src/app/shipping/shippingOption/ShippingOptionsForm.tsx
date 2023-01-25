import { CheckoutSelectors, Consignment } from '@bigcommerce/checkout-sdk';
import { FormikProps, withFormik } from 'formik';
import { noop } from 'lodash';
import React, { PureComponent, ReactNode } from 'react';

import { AnalyticsContextProps } from '@bigcommerce/checkout/analytics';
import { ChecklistSkeleton } from '@bigcommerce/checkout/ui';

import { StaticAddress } from '../../address';
import { withAnalytics } from '../../analytics';
import { TranslatedString } from '../../locale';
import getRecommendedShippingOption from '../getRecommendedShippingOption';
import StaticConsignmentItemList from '../StaticConsignmentItemList';

import { ShippingOptionsProps, WithCheckoutShippingOptionsProps } from './ShippingOptions';
import './ShippingOptionsForm.scss';
import ShippingOptionsList from './ShippingOptionsList';

export type ShippingOptionsFormProps = ShippingOptionsProps & WithCheckoutShippingOptionsProps & AnalyticsContextProps;

class ShippingOptionsForm extends PureComponent<
    ShippingOptionsFormProps & FormikProps<ShippingOptionsFormValues>, { couponApplied: boolean }
> {
    constructor(props: any)
    {
        super(props)
        this.state = { couponApplied: false };
    }

    private unsubscribe?: () => void;

    componentDidMount(): void {
        const { subscribeToConsignments } = this.props;

        this.unsubscribe = subscribeToConsignments(this.selectDefaultShippingOptions);
    }

    async componentDidUpdate(): Promise<void> {
        const {
            analyticsTracker,
            consignments,
            shouldShowShippingOptions
        } = this.props;

        if (consignments?.length && shouldShowShippingOptions) {
            analyticsTracker.showShippingMethods();

            const availableShippingOptions = this.props?.consignments?.length ? this.props.consignments[0].availableShippingOptions : null

            if(!this.state.couponApplied)
            {
                if(availableShippingOptions?.length){
                    const expressShipping = availableShippingOptions.find( option => option.description === 'FedEx (FedEx Express Saver)' );
                    const standardShipping = availableShippingOptions.find( option => option.description === 'FedEx (Ground Home Delivery)' );

                    if(expressShipping && standardShipping)
                    {
                        const delta = standardShipping.cost

                        // Create coupon
                        const { coupons, id: cartId } = this.props.cart;

                        if(!coupons?.length)
                        {
                            this.setState({couponApplied: true});
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
                                    this.props.checkoutService.applyCoupon(data.code);
                                }
                            });
                        }
                        else
                        {
                            const existingCoupon = coupons.find(coupon => coupon.code === cartId);

                            if(existingCoupon)
                            {
                                if(existingCoupon.discountedAmount.toFixed(4) !== delta.toFixed(4))
                                {
                                    this.setState({couponApplied: true});
                                    await this.props.checkoutService.removeCoupon(cartId);
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
                                            this.props.checkoutService.applyCoupon(data.code)
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    componentWillUnmount(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = undefined;
        }
    }

    render(): ReactNode {
        const {
            consignments,
            isMultiShippingMode,
            selectShippingOption,
            isLoading,
            shouldShowShippingOptions,
            invalidShippingMessage,
            methodId
        } = this.props;

        if (!consignments?.length || !shouldShowShippingOptions) {
            return (
                <ChecklistSkeleton
                    additionalClassName="shippingOptions-skeleton"
                    isLoading={isLoading()}
                    rows={2}
                >
                    {this.renderNoShippingOptions(
                        <TranslatedString
                            id={
                                methodId || isMultiShippingMode
                                    ? 'shipping.select_shipping_address_text'
                                    : 'shipping.enter_shipping_address_text'
                            }
                        />,
                    )}
                </ChecklistSkeleton>
            );
        }

        return (
            <>
                {consignments.map((consignment) => (
                    <div className="shippingOptions-container form-fieldset" key={consignment.id}>
                        {isMultiShippingMode && this.renderConsignment(consignment)}

                        <ShippingOptionsList
                            consignmentId={consignment.id}
                            inputName={getRadioInputName(consignment.id)}
                            isLoading={isLoading(consignment.id)}
                            onSelectedOption={selectShippingOption}
                            selectedShippingOptionId={
                                consignment.selectedShippingOption &&
                                consignment.selectedShippingOption.id
                            }
                            shippingOptions={consignment.availableShippingOptions}
                        />

                        {(!consignment.availableShippingOptions ||
                            !consignment.availableShippingOptions.length) && (
                            <ChecklistSkeleton
                                additionalClassName="shippingOptions-skeleton"
                                isLoading={isLoading(consignment.id)}
                                rows={2}
                            >
                                {this.renderNoShippingOptions(invalidShippingMessage)}
                            </ChecklistSkeleton>
                        )}
                    </div>
                ))}
            </>
        );
    }

    private selectDefaultShippingOptions: (state: CheckoutSelectors) => void = async ({ data }) => {
        const { selectShippingOption, setFieldValue } = this.props;

        const consignment = (data.getConsignments() || []).find(
            ({ selectedShippingOption, availableShippingOptions: shippingOptions }) =>
                !selectedShippingOption && shippingOptions,
        );

        if (!consignment || !consignment.availableShippingOptions) {
            return;
        }

        const { availableShippingOptions, id } = consignment;
        const recommendedOption = getRecommendedShippingOption(availableShippingOptions);
        const singleShippingOption =
            availableShippingOptions.length === 1 && availableShippingOptions[0];
        const defaultShippingOption = recommendedOption || singleShippingOption;

        if (!defaultShippingOption) {
            return;
        }

        await selectShippingOption(id, defaultShippingOption.id);
        setFieldValue(`shippingOptionIds.${id}`, defaultShippingOption.id);
    };

    private renderNoShippingOptions(message: ReactNode): ReactNode {
        return (
            <div className="shippingOptions-panel optimizedCheckout-overlay">
                <p
                    aria-live="polite"
                    className="shippingOptions-panel-message optimizedCheckout-primaryContent"
                    role="alert"
                >
                    {message}
                </p>
            </div>
        );
    }

    private renderConsignment(consignment: Consignment): ReactNode {
        const { cart } = this.props;

        return (
            <div className="staticConsignment">
                <strong>
                    <TranslatedString id="shipping.shipping_address_heading" />
                </strong>

                <StaticAddress address={consignment.shippingAddress} />

                <StaticConsignmentItemList cart={cart} consignment={consignment} />
            </div>
        );
    }
}

function getRadioInputName(consignmentId: string): string {
    return `shippingOptionIds.${consignmentId}`;
}

export interface ShippingOptionsFormValues {
    shippingOptionIds: {
        [shippingOptionIds: string]: string;
    };
}

export default withAnalytics(withFormik<ShippingOptionsFormProps, ShippingOptionsFormValues>({
    handleSubmit: noop,
    mapPropsToValues({ consignments }) {
        const shippingOptionIds: { [id: string]: string } = {};

        (consignments || []).forEach((consignment) => {
            shippingOptionIds[consignment.id] = consignment.selectedShippingOption
                ? consignment.selectedShippingOption.id
                : '';
        });

        return { shippingOptionIds };
    },
})(ShippingOptionsForm));
