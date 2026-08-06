import React from 'react';
import { classNames } from '../../utils/helpers';
export interface StepperProps { steps: string[]; currentStep: number; orientation?: 'horizontal'|'vertical'; }
export const Stepper = ({ steps, currentStep, orientation = 'horizontal' }: StepperProps) => (
  <div className={classNames('stepper', orientation === 'vertical' && 'flex-col h-full')}>
    {steps.map((s, i) => (
      <div key={s} className={classNames('stepper-step', i < currentStep && 'stepper-completed', i === currentStep && 'stepper-active')}>
        <div className="step-circle">{i < currentStep ? '✓' : i + 1}</div>
        <span className="text-xs mt-1">{s}</span>
      </div>
    ))}
  </div>
);