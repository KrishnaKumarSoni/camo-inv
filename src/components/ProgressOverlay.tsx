// Progress overlay for AI processing steps
// PRD: progress_overlay: "Full screen modal with white background and black text"
// PRD: step_indicators: "Step 1: Converting speech, Step 2: Understanding equipment, Step 3: Researching specs, Step 4: Preparing form"

import React from 'react';
import { X, Check, CircleNotch } from 'phosphor-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressOverlayProps {
  isVisible: boolean;
  currentStep: number;
  onCancel: () => void;
  steps?: ProcessingStep[];
}

const defaultSteps: ProcessingStep[] = [
  {
    id: 'speech',
    title: 'Converting Speech',
    description: 'Transcribing your audio using AI...',
    status: 'pending'
  },
  {
    id: 'understanding',
    title: 'Understanding Equipment',
    description: 'Extracting equipment details from description...',
    status: 'pending'
  },
  {
    id: 'research',
    title: 'Researching Specs',
    description: 'Finding technical specifications online...',
    status: 'pending'
  },
  {
    id: 'preparing',
    title: 'Preparing Form',
    description: 'Creating your pre-filled form...',
    status: 'pending'
  }
];

export default function ProgressOverlay({ 
  isVisible, 
  currentStep, 
  onCancel, 
  steps = defaultSteps 
}: ProgressOverlayProps) {
  if (!isVisible) return null;

  // Update step statuses based on current step
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    status: index < currentStep ? 'completed' : index === currentStep ? 'processing' : 'pending'
  }));

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* PRD: design: "Full screen modal with white background and black text" */}
      
      {/* Header with cancel button */}
      {/* PRD: cancellation: "X button in top right to cancel processing" */}
      <div className="flex justify-between items-center p-6 border-b border-gray-light">
        <h2 className="font-heading text-lg font-semibold">Processing Your Recording</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-light rounded-button"
          aria-label="Cancel processing"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress steps */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="space-y-6">
          {updatedSteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              {/* Step indicator */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center">
                {step.status === 'completed' ? (
                  <Check size={16} weight="bold" className="text-accent" />
                ) : step.status === 'processing' ? (
                  <CircleNotch size={16} className="text-accent animate-spin" />
                ) : (
                  <span className="text-gray-medium text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${
                  step.status === 'processing' ? 'text-accent' : 
                  step.status === 'completed' ? 'text-green-600' : 
                  'text-gray-medium'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-medium mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-medium mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-light rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Note about real processing */}
        {/* PRD: critical: Never simulate this process. DO this really as in always ensure apis are called and data is processed in reality. */}
        <div className="mt-6 p-4 bg-gray-light rounded-input">
          <p className="text-xs text-gray-medium text-center">
            Real AI processing in progress - this may take 30-60 seconds
          </p>
        </div>
      </div>
    </div>
  );
}