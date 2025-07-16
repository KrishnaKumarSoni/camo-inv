// Voice recording interface component
// PRD: recording_interface: "Large purple microphone button in center with recording animation"
// PRD: microphone_button: "120px circular button with Phosphor microphone icon that manages both start and stop recording"

import React from 'react';
import { Microphone, Stop, ArrowClockwise } from 'phosphor-react';
import { useRecording } from '../hooks/useRecording';

interface RecordingInterfaceProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export default function RecordingInterface({ onRecordingComplete, disabled = false }: RecordingInterfaceProps) {
  const {
    isRecording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
    error
  } = useRecording();

  // Format recording time for display
  // PRD: timer_display: "Recording duration shown below button"
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (audioBlob) {
      // If we have a recording, play it back or proceed
      onRecordingComplete(audioBlob);
    } else {
      startRecording();
    }
  };

  const handleStartOver = () => {
    resetRecording();
  };

  const handleUseSample = () => {
    // PRD: samples: "A CTA to use a sample text (instead of recording) and do the full real processing experience (no simulating)"
    const sampleText = "I have a Canon EOS R5 camera in excellent condition. It's a professional mirrorless camera with 45 megapixel sensor. Serial number is 123456789. I purchased it for 300,000 rupees and it's currently worth about 250,000 rupees. It's stored in cabinet A, shelf 2.";
    
    // Create a fake audio blob for the sample text
    const sampleBlob = new Blob([sampleText], { type: 'text/plain' });
    // Add a property to identify this as sample text
    (sampleBlob as any).isSampleText = true;
    (sampleBlob as any).sampleText = sampleText;
    
    onRecordingComplete(sampleBlob);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Error display */}
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-input text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      {/* PRD: helpers: "Guiding words in form of chips with examples to help the user know what to speak." */}
      <div className="w-full text-center">
        <p className="text-gray-medium text-sm mb-3">Describe your equipment:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-gray-light text-xs rounded-full">Brand & Model</span>
          <span className="px-3 py-1 bg-gray-light text-xs rounded-full">Condition</span>
          <span className="px-3 py-1 bg-gray-light text-xs rounded-full">Serial Number</span>
          <span className="px-3 py-1 bg-gray-light text-xs rounded-full">Purchase Price</span>
        </div>
      </div>

      {/* Main recording button */}
      {/* PRD: microphone_button: "120px circular button with Phosphor microphone icon" */}
      <div className="relative">
        <button
          onClick={handleButtonClick}
          disabled={disabled}
          className={`
            w-30 h-30 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50
            ${isRecording 
              ? 'bg-accent animate-pulse' // PRD: recording_state: "Purple background when recording with pulse animation"
              : audioBlob 
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-accent hover:bg-purple-600'
            }
          `}
        >
          {isRecording ? (
            <Stop size={40} weight="fill" className="text-white" />
          ) : audioBlob ? (
            <span className="text-white font-semibold text-sm">Process</span>
          ) : (
            <Microphone size={40} weight="fill" className="text-white" />
          )}
        </button>

        {/* Recording indicator ring */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-accent opacity-50 animate-ping"></div>
        )}
      </div>

      {/* PRD: timer_display: "Recording duration shown below button" */}
      {(isRecording || recordingTime > 0) && (
        <div className="text-center">
          <div className="text-2xl font-mono font-semibold">
            {formatTime(recordingTime)}
          </div>
          <div className="text-gray-medium text-sm">
            {isRecording ? 'Recording...' : 'Recorded'}
            {recordingTime >= 120 && ' (Max time reached)'}
          </div>
        </div>
      )}

      {/* PRD: controls: "Stop recording and start over buttons when active" */}
      {(audioBlob && !isRecording) && (
        <div className="flex space-x-4">
          <button
            onClick={handleStartOver}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-medium rounded-button text-gray-medium hover:bg-gray-light"
          >
            <ArrowClockwise size={16} />
            <span>Start Over</span>
          </button>
        </div>
      )}

      {/* PRD: samples: "A CTA to use a sample text (instead of recording) and do the full real processing experience" */}
      {!isRecording && !audioBlob && (
        <button
          onClick={handleUseSample}
          className="text-accent underline text-sm hover:text-purple-600"
        >
          Or try with sample description
        </button>
      )}
    </div>
  );
}