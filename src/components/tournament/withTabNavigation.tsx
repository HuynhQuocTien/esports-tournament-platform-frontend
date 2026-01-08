import React from 'react';
import type { TournamentStepProps } from '@/common/types/tournament';

export interface TabNavigationProps extends TournamentStepProps {
  setActiveTab: (tab: string) => void;
  onNextStep?: () => void;
}

export const withTabNavigation = (
  Component: React.ComponentType<TabNavigationProps>, 
  nextTab: string,
  options?: {
    validateBeforeNext?: (data: any) => boolean;
  }
) => {
  const WrappedComponent: React.FC<TabNavigationProps> = (props) => {
    const handleNextStep = () => {
      if (options?.validateBeforeNext) {
        const isValid = options.validateBeforeNext(props.data);
        if (!isValid) {
          return;
        }
      }
      
      if (props.setActiveTab) {
        props.setActiveTab(nextTab);
      }
      
      if (props.onNextStep) {
        props.onNextStep();
      }
    };
    
    return <Component {...props} onNextStep={handleNextStep} />;
  };
  
  WrappedComponent.displayName = `withTabNavigation(${Component.displayName || Component.name})`;
  return WrappedComponent;
};