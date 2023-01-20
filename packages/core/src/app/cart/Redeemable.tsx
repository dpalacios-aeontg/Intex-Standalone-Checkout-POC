import { CheckoutSelectors, RequestError } from '@bigcommerce/checkout-sdk';
import { FormikProps, withFormik } from 'formik';
import React, { FunctionComponent, memo, } from 'react';
import { object, string } from 'yup';

import { withLanguage, WithLanguageProps } from '../locale';
import { AppliedRedeemablesProps } from './AppliedRedeemables';

export interface RedeemableFormValues {
    redeemableCode: string;
}

export type ReedemableChildrenProps = Pick<
    RedeemableProps,
    | 'onRemovedCoupon'
    | 'onRemovedGiftCertificate'
    | 'isRemovingGiftCertificate'
    | 'isRemovingCoupon'
    | 'coupons'
    | 'giftCertificates'
>;

export type RedeemableProps = {
    appliedRedeemableError?: RequestError;
    isApplyingRedeemable?: boolean;
    isRemovingRedeemable?: boolean;
    removedRedeemableError?: RequestError;
    showAppliedRedeemables?: boolean;
    shouldCollapseCouponCode?: boolean;
    applyCoupon(code: string): Promise<CheckoutSelectors>;
    applyGiftCertificate(code: string): Promise<CheckoutSelectors>;
    clearError(error: Error): void;
} & AppliedRedeemablesProps;

const Redeemable: FunctionComponent<
    RedeemableProps & WithLanguageProps & FormikProps<RedeemableFormValues>
> = (/*{ ...formProps }*/) => {

    // if(formProps?.coupons?.length === 0){
    //     (async () => {
    //         await formProps.applyCoupon('SHIPPINGTEST');
    //     })()
    // }

    return <></>;
}

export default withLanguage(
    withFormik<RedeemableProps & WithLanguageProps, RedeemableFormValues>({
        mapPropsToValues() {
            return {
                redeemableCode: '',
            };
        },

        async handleSubmit(
            { redeemableCode },
            { props: { applyCoupon, applyGiftCertificate, clearError } },
        ) {
            const code = redeemableCode.trim();

            try {
                await applyGiftCertificate(code);
            } catch (error) {
                if (error instanceof Error) {
                    clearError(error);
                }

                applyCoupon(code);
            }
        },

        validationSchema({ language }: RedeemableProps & WithLanguageProps) {
            return object({
                redeemableCode: string().required(
                    language.translate('redeemable.code_required_error'),
                ),
            });
        },
    })(memo(Redeemable)),
);
