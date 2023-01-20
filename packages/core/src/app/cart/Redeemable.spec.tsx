import { RequestError } from '@bigcommerce/checkout-sdk';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';

import { getStoreConfig } from '../config/config.mock';
import { createLocaleContext, LocaleContext, LocaleContextType } from '../locale';

import Redeemable from './Redeemable';

describe('CartSummary Component', () => {
    let localeContext: LocaleContextType;
    let component: ReactWrapper;
    const applyCoupon = jest.fn();
    const applyGiftCertificate = jest.fn();
    const clearError = jest.fn();
    const onRemovedCoupon = jest.fn();
    const onRemovedGiftCertificate = jest.fn();
    const minPurchaseError = {
        errors: [{ code: 'min_purchase' }],
    } as RequestError;

    describe('when coupon code is not collapsed', () => {
        beforeEach(() => {
            localeContext = createLocaleContext(getStoreConfig());

            component = mount(
                <LocaleContext.Provider value={localeContext}>
                    <Redeemable
                        appliedRedeemableError={minPurchaseError}
                        applyCoupon={applyCoupon}
                        applyGiftCertificate={applyGiftCertificate}
                        clearError={clearError}
                        isApplyingRedeemable={true}
                        onRemovedCoupon={onRemovedCoupon}
                        onRemovedGiftCertificate={onRemovedGiftCertificate}
                        shouldCollapseCouponCode={false}
                    />
                </LocaleContext.Provider>,
            );
        });

        it('does not render toggle link', () => {
            expect(component.find('[data-test="redeemable-label"]')).toHaveLength(0);
        });
    });
});
