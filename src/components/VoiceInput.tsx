// Import React hooks for state and ref management, along with icons, UI components, and translation
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react'; // Icons for microphone states
import { Button } from './ui/button'; // Custom button component for UI
import { useTranslation } from 'react-i18next'; // Hook for internationalization and translations

// Define props interface for the VoiceInput component
interface VoiceInputProps {
  onTranscript: (text: string) => void; // Callback to handle the transcribed text
  isListening: boolean; // State to track if voice input is active
  setIsListening: (isListening: boolean) => void; // Function to toggle the listening state
}

// VoiceInput component: Handles voice-to-text input using the Web Speech API
export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  isListening,
  setIsListening
}) => {
  // Initialize hooks for translation and state management
  const { t, i18n } = useTranslation(); // Access translation functions and current language
  const [error, setError] = useState<string | null>(null); // State to store error messages
  const recognitionRef = useRef<SpeechRecognition | null>(null); // Ref to store the SpeechRecognition instance

  // Function to start listening for voice input
  const startListening = () => {
    try {
      // Check if the browser supports the Web Speech API
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        // Throw an error with a translated message if the API is not supported
        throw new Error(
          i18n.language === 'mr' ? 
            'तुमचा ब्राउझर व्हॉइस इनपुटला समर्थन देत नाही.' :
          i18n.language === 'gu' ? 
            'તમારું બ્રાઉઝર વૉઇસ ઇનપુટને સપોર્ટ કરતું નથી.' :
          i18n.language === 'hi' ? 
            'आपका ब्राउज़र वॉइस इनपुट को समर्थन नहीं करता है.' :
            'Your browser does not support voice input.'
        );
      }

      // Initialize the SpeechRecognition API (cross-browser compatibility)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Set the language for speech recognition based on the current app language
      recognition.lang = i18n.language === 'mr' ? 'mr-IN' : // Marathi (India)
                        i18n.language === 'gu' ? 'gu-IN' : // Gujarati (India)
                        i18n.language === 'hi' ? 'hi-IN' : // Hindi (India)
                        'en-US'; // Default to English (US)
      
      // Configure recognition settings
      recognition.continuous = true; // Keep listening until explicitly stopped
      recognition.interimResults = true; // Provide interim (partial) results while speaking

      // Handle speech recognition results
      recognition.onresult = (event) => {
        // Combine all transcript segments into a single string
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        // Pass the transcript to the parent component via the onTranscript callback
        onTranscript(transcript);
      };

      // Handle errors during speech recognition
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Set a translated error message based on the current language
        setError(
          i18n.language === 'mr' ? 
            'व्हॉइस इनपुट मध्ये त्रुटी आली.' :
          i18n.language === 'gu' ? 
            'વૉઇસ ઇનપુટમાં ભૂલ આવી.' :
          i18n.language === 'hi' ? 
            'वॉइस इनपुट में त्रुटि आई.' :
            'Error in voice input.'
        );
        // Stop listening if an error occurs
        setIsListening(false);
      };

      // Handle the end of a recognition session
      recognition.onend = () => {
        // Automatically restart recognition if still in listening mode
        if (isListening) {
          recognition.start();
        }
      };

      // Start the speech recognition process
      recognition.start();
      // Store the recognition instance in the ref for later control
      recognitionRef.current = recognition;
      // Update the listening state to true
      setIsListening(true);
      // Clear any previous errors
      setError(null);
    } catch (err) {
      // Handle setup errors (e.g., browser support)
      console.error('Speech recognition setup error:', err);
      // Set the error message to display to the user
      setError(err instanceof Error ? err.message : 'Failed to start voice input');
      // Ensure listening state is set to false
      setIsListening(false);
    }
  };

  // Function to stop listening for voice input
  const stopListening = () => {
    // Check if there is an active recognition instance
    if (recognitionRef.current) {
      // Stop the recognition process
      recognitionRef.current.stop();
      // Clear the ref
      recognitionRef.current = null;
    }
    // Update the listening state to false
    setIsListening(false);
  };

  // Render the voice input button and error message
  return (
    <div className="relative">
      {/* Button to toggle voice input */}
      <Button
        variant={isListening ? "destructive" : "outline"} // Change style based on listening state
        size="icon"
        className={`relative h-12 w-12 rounded-full ${isListening ? 'animate-pulse' : ''}`} // Add pulse animation when listening
        onClick={isListening ? stopListening : startListening} // Toggle between start and stop
        title={
          // Set the button tooltip based on the current state and language
          isListening ?
            i18n.language === 'mr' ? 'व्हॉइस इनपुट थांबवा' :
            i18n.language === 'gu' ? 'વૉઇસ ઇનપુટ બંધ કરો' :
            i18n.language === 'hi' ? 'वॉइस इनपुट बंद करें' :
            'Stop voice input' :
            i18n.language === 'mr' ? 'व्हॉइस इनपुट सुरू करा' :
            i18n.language === 'gu' ? 'વૉઇસ ઇનપુટ શરૂ કરો' :
            i18n.language === 'hi' ? 'वॉइस इनपुट शुरू करें' :
            'Start voice input'
        }
      >
        {isListening ? (
          <>
            {/* Show MicOff icon and screen reader text when listening */}
            <MicOff className="h-5 w-5" />
            <span className="sr-only">Stop Recording</span>
          </>
        ) : (
          <>
            {/* Show Mic icon and screen reader text when not listening */}
            <Mic className="h-5 w-5" />
            <span className="sr-only">Start Recording</span>
          </>
        )}
      </Button>

      {/* Display error message if there is an error */}
      {error && (
        <div className="absolute top-full mt-2 w-48 p-2 bg-destructive text-destructive-foreground text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};