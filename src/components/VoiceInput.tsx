import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  isListening,
  setIsListening
}) => {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
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

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = i18n.language === 'mr' ? 'mr-IN' :
                        i18n.language === 'gu' ? 'gu-IN' :
                        i18n.language === 'hi' ? 'hi-IN' :
                        'en-US';
      
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        onTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(
          i18n.language === 'mr' ? 
            'व्हॉइस इनपुट मध्ये त्रुटी आली.' :
          i18n.language === 'gu' ? 
            'વૉઇસ ઇનપુટમાં ભૂલ આવી.' :
          i18n.language === 'hi' ? 
            'वॉइस इनपुट में त्रुटि आई.' :
            'Error in voice input.'
        );
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error('Speech recognition setup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start voice input');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  return (
    <div className="relative">
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        className={`relative h-12 w-12 rounded-full ${isListening ? 'animate-pulse' : ''}`}
        onClick={isListening ? stopListening : startListening}
        title={
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
            <MicOff className="h-5 w-5" />
            <span className="sr-only">Stop Recording</span>
          </>
        ) : (
          <>
            <Mic className="h-5 w-5" />
            <span className="sr-only">Start Recording</span>
          </>
        )}
      </Button>

      {error && (
        <div className="absolute top-full mt-2 w-48 p-2 bg-destructive text-destructive-foreground text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};