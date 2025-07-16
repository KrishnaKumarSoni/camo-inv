// Add Item page - main onboarding flow
// PRD: add_item: "Main onboarding flow at /add with voice recording and form"
// PRD: voice_to_form_workflow: 4-step process from recording to form

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordingInterface from '../components/RecordingInterface';
import ProgressOverlay from '../components/ProgressOverlay';
import EquipmentForm from '../components/EquipmentForm';

interface ProcessedData {
  transcript: string;
  extracted_data: any;
  research_data: any;
  confidence_scores: any;
  form_data: any;
}

export default function AddItem() {
  const [currentStep, setCurrentStep] = useState<'recording' | 'processing' | 'form'>('recording');
  const [processingStep, setProcessingStep] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setCurrentStep('processing');
    setIsProcessing(true);
    setProcessingStep(0);

    try {
      // PRD: ciritcal: Never simulate this process. DO this really as in always ensure apis are called and data is processed in reality.
      
      // Check if this is sample text
      const isSampleText = (audioBlob as any).isSampleText;
      const sampleText = (audioBlob as any).sampleText;

      if (isSampleText) {
        // Process sample text through the same real pipeline
        await processSampleText(sampleText);
      } else {
        // Process real audio recording
        await processAudioRecording(audioBlob);
      }

    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Please try again.');
      setCurrentStep('recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const processSampleText = async (sampleText: string) => {
    // Use the real backend API for sample text processing
    // PRD: ciritcal: Never simulate this process. DO this really as in always ensure apis are called and data is processed in reality.
    
    // Show progress steps
    setProcessingStep(1);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/process-sample`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sample_text: sampleText
        })
      });

      if (!response.ok) {
        throw new Error('Sample processing failed');
      }

      // Simulate progress updates while waiting for response
      const progressInterval = setInterval(() => {
        setProcessingStep(prev => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 1000);

      const data = await response.json();
      clearInterval(progressInterval);
      
      setProcessingStep(4);
      setProcessedData(data);
      setCurrentStep('form');
      
    } catch (error) {
      console.error('Sample processing failed:', error);
      throw error;
    }
  };

  const processAudioRecording = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    // Call the real API endpoint for processing
    // PRD: "/api/process-audio": "POST - Accept audio file, transcribe with Whisper, extract with GPT, research web, return structured data"
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/process-audio`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Audio processing failed');
    }

    // Simulate progress updates while waiting for response
    const progressInterval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 2000);

    const data = await response.json();
    clearInterval(progressInterval);
    
    setProcessingStep(4);
    setProcessedData(data);
    setCurrentStep('form');
  };


  const handleFormSubmit = async (formData: any) => {
    try {
      // PRD: step_4_save: "Save to Firebase Firestore with automatic SKU linking or creation"
      
      // First create or link SKU
      const skuResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/skus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          brand: formData.brand,
          model: formData.model,
          category: formData.category,
          description: formData.description,
          specifications: formData.specifications,
          price_per_day: formData.price_per_day || 0,
          security_deposit: formData.security_deposit || 0,
          image_url: formData.primary_image || ''
        })
      });

      const skuData = await skuResponse.json();

      // Then create inventory item
      const inventoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku_id: skuData.sku_id,
          serial_number: formData.serial_number,
          barcode: formData.barcode,
          condition: formData.condition,
          status: 'available',
          location: formData.location,
          purchase_price: formData.purchase_price,
          current_value: formData.current_value,
          notes: formData.notes,
          created_by: 'current_user' // Would get from auth context
        })
      });

      if (inventoryResponse.ok) {
        // PRD: success_feedback: "Confirmation screen with options to add another item or view inventory"
        alert('Equipment added successfully!');
        navigate('/inventory');
      } else {
        throw new Error('Failed to save inventory item');
      }

    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save equipment. Please try again.');
    }
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setCurrentStep('recording');
    setProcessingStep(0);
  };

  return (
    <div className="mobile-container">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-light">
          <h1 className="font-heading text-xl font-semibold">Add Equipment</h1>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {currentStep === 'recording' && (
            <div className="text-center">
              <h2 className="font-heading text-lg mb-2">Record Equipment Description</h2>
              <p className="text-gray-medium mb-8">
                Describe the equipment you want to add to inventory
              </p>
              
              <RecordingInterface 
                onRecordingComplete={handleRecordingComplete}
                disabled={isProcessing}
              />
            </div>
          )}

          {currentStep === 'form' && processedData && (
            <EquipmentForm
              initialData={processedData.form_data}
              confidenceScores={processedData.confidence_scores}
              onSubmit={handleFormSubmit}
              onCancel={() => setCurrentStep('recording')}
            />
          )}
        </div>

        {/* Progress Overlay */}
        <ProgressOverlay
          isVisible={currentStep === 'processing'}
          currentStep={processingStep}
          onCancel={handleCancelProcessing}
        />
      </div>
    </div>
  );
}