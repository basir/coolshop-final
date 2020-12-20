import { Step, StepLabel, Stepper } from '@material-ui/core';
import React from 'react';

export default function CheckoutSteps({ activeStep = 0 }) {
  return (
    <Stepper activeStep={activeStep}>
      <Step>
        <StepLabel>Sign-In</StepLabel>
      </Step>
      <Step>
        <StepLabel>Shipping Address</StepLabel>
      </Step>
      <Step>
        <StepLabel>Payment Method</StepLabel>
      </Step>
      <Step>
        <StepLabel>Place Order</StepLabel>
      </Step>
    </Stepper>

    // <div className="row checkout-steps">
    //   <div className={props.step1 ? 'active' : ''}>Sign-In</div>
    //   <div className={props.step2 ? 'active' : ''}>Shipping</div>
    //   <div className={props.step3 ? 'active' : ''}>Payment</div>
    //   <div className={props.step4 ? 'active' : ''}>Place Order</div>
    // </div>
  );
}
