/**
 * Onboarding Flow Component
 * Main wizard that orchestrates all onboarding steps
 */

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { OnboardingLayout } from './OnboardingLayout';
import { WelcomeStep } from './WelcomeStep';
import { CreateClientStep, type ClientFormData } from './CreateClientStep';
import { ConnectPlatformsStep } from './ConnectPlatformsStep';
import { TourStep } from './TourStep';
import { createClient } from '@/app/actions/clients/createClient';

const TOTAL_STEPS = 4;

export function OnboardingFlow() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  const [clientFormData, setClientFormData] = useState<ClientFormData | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [connectedPlatformsCount, setConnectedPlatformsCount] = useState(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('onboarding_progress');
      if (saved) {
        const { step, clientId } = JSON.parse(saved);
        if (step && step <= TOTAL_STEPS) {
          setCurrentStep(step);
        }
        if (clientId) {
          setCreatedClientId(clientId);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (step: number, clientId?: string) => {
    try {
      localStorage.setItem(
        'onboarding_progress',
        JSON.stringify({
          step,
          clientId: clientId || createdClientId,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep);
    }
  };

  // Handle client creation (Step 2) - this is called from the layout Next button
  const handleCreateClient = async () => {
    if (!clientFormData) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await createClient(clientFormData);

      if (!result.success) {
        setError(result.error || 'Failed to create client. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store created client ID
      setCreatedClientId(result.client!.id);

      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep, result.client!.id);
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form data change from CreateClientStep
  const handleFormDataChange = (data: ClientFormData, isValid: boolean) => {
    setClientFormData(data);
    setIsFormValid(isValid);
  };

  // Complete onboarding
  const handleComplete = async () => {
    setIsLoading(true);

    try {
      if (!session?.user?.id) {
        console.error('No user session found');
        setIsLoading(false);
        return;
      }

      // Mark onboarding as completed using server action
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      // Clear localStorage
      localStorage.removeItem('onboarding_progress');

      // Redirect to chat
      router.push('/chat');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Even if there's an error, redirect to chat (fail open)
      localStorage.removeItem('onboarding_progress');
      router.push('/chat');
    } finally {
      setIsLoading(false);
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep userName={session?.user?.name || undefined} />;

      case 2:
        return (
          <CreateClientStep
            onChange={handleFormDataChange}
            isLoading={isLoading}
            error={error || undefined}
          />
        );

      case 3:
        return (
          <Suspense fallback={<div className="text-center text-[#999]">Loading platforms...</div>}>
            <ConnectPlatformsStep
              clientId={createdClientId || undefined}
              onConnectionsChange={setConnectedPlatformsCount}
            />
          </Suspense>
        );

      case 4:
        return <TourStep />;

      default:
        return <WelcomeStep />;
    }
  };

  // Determine next button label
  const getNextLabel = () => {
    if (currentStep === TOTAL_STEPS) {
      return 'Start Using OneAssist';
    }
    if (currentStep === 2) {
      return 'Create Client & Continue';
    }
    if (currentStep === 3) {
      // Show "Continue" if platforms are connected, otherwise "Skip for Now"
      return connectedPlatformsCount > 0 ? 'Continue' : 'Skip for Now';
    }
    return 'Continue';
  };

  // Determine if next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 2) {
      return !isFormValid; // Disabled until form is valid
    }
    return false;
  };

  // Handle next button click
  const handleNextClick = () => {
    if (currentStep === 2) {
      handleCreateClient();
      return;
    }
    handleNext();
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNextClick}
      onBack={handleBack}
      nextLabel={getNextLabel()}
      nextDisabled={isNextDisabled()}
      showBack={currentStep > 1}
      isLoading={isLoading}
    >
      {renderStepContent()}
    </OnboardingLayout>
  );
}
