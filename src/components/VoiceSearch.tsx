import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface VoiceSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function VoiceSearch({ isOpen, onClose, onSearch }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('🎤 Listening...', {
        description: 'Speak now to search for products',
      });
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart + ' ';
        } else {
          interim += transcriptPart;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript(prev => (prev + final).trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setIsSupported(false);
        setIsListening(false);
        toast.error('Microphone Permission Denied', {
          description: 'Please allow microphone access in your browser settings, then refresh this page',
          duration: 6000,
        });
      } else if (event.error === 'no-speech') {
        setIsListening(false);
        toast.info('No speech detected', {
          description: 'Click the microphone and try speaking again',
          duration: 3000,
        });
      } else if (event.error === 'aborted') {
        // Silent error - user stopped listening
        setIsListening(false);
      } else if (event.error === 'audio-capture') {
        setIsSupported(false);
        setIsListening(false);
        toast.error('Microphone Not Found', {
          description: 'Please check that your microphone is connected and enabled',
          duration: 5000,
        });
      } else if (event.error === 'network') {
        setIsListening(false);
        toast.error('Network Error', {
          description: 'Speech recognition requires an internet connection',
          duration: 4000,
        });
      } else {
        setIsListening(false);
        toast.error('Voice Recognition Error', {
          description: `${event.error} - Please try again`,
          duration: 4000,
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Stop listening and clear transcript when dialog closes
      stopListening();
      setTranscript('');
      setInterimTranscript('');
    }
    // Don't automatically start - wait for user to click the microphone button
  }, [isOpen]);

  const startListening = async () => {
    if (!recognitionRef.current || isListening) return;

    // Check for microphone permission before starting
    try {
      // Request microphone permission explicitly
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Permission granted, stop the stream as we only needed to check
          stream.getTracks().forEach(track => track.stop());
        } catch (permError: any) {
          console.error('Microphone permission error:', permError);
          setIsSupported(false);
          toast.error('Microphone Access Required', {
            description: 'Please allow microphone access and try again',
            duration: 5000,
          });
          return;
        }
      }

      // Now start speech recognition
      recognitionRef.current.start();
    } catch (error: any) {
      console.error('Error starting recognition:', error);
      if (error.name === 'NotAllowedError' || error.message.includes('not-allowed')) {
        setIsSupported(false);
        toast.error('Microphone Permission Denied', {
          description: 'Please allow microphone access in your browser settings and refresh the page',
          duration: 5000,
        });
      } else if (error.name === 'InvalidStateError') {
        // Recognition is already started, just ignore
        console.log('Speech recognition already started');
      } else {
        toast.error('Voice Recognition Error', {
          description: 'Could not start voice recognition. Please try again.',
          duration: 4000,
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSearch = () => {
    const searchText = transcript.trim();
    if (searchText) {
      onSearch(searchText);
      toast.success('🔍 Searching...', {
        description: `Looking for "${searchText}"`,
      });
      onClose();
    } else {
      toast.error('No speech detected', {
        description: 'Please speak your search query',
      });
    }
  };

  const handleClose = () => {
    stopListening();
    onClose();
  };

  if (!isSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Search Not Available</DialogTitle>
            <DialogDescription>
              Voice recognition is not supported or microphone access was denied
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <MicOff className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Voice search needs microphone permission to work.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-left space-y-3">
              <p className="font-medium text-amber-900 dark:text-amber-100">How to enable microphone:</p>
              <ol className="list-decimal list-inside space-y-2 text-amber-800 dark:text-amber-200">
                <li>Look for the <strong>microphone icon</strong> in your browser's address bar</li>
                <li>Click it and select <strong>"Allow"</strong> or <strong>"Always allow"</strong></li>
                <li>Refresh this page</li>
                <li>Click the microphone button again</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Note:</strong> Voice search works best in Chrome, Edge, and Safari browsers.
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="mt-6 bg-amber-500 hover:bg-amber-600">
              Close & Use Text Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🎤 Voice Search</DialogTitle>
          <DialogDescription>
            {isListening ? 'Listening... Speak now to search for products' : 'Click the microphone button below to start voice search'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">

          {/* Microphone Visual */}
          <div className="flex justify-center">
            <div className={`relative ${isListening ? 'animate-pulse' : ''}`}>
              {/* Pulsing rings when listening */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="absolute inset-[-8px] rounded-full bg-emerald-500/10 animate-ping" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute inset-[-16px] rounded-full bg-emerald-500/5 animate-ping" style={{ animationDelay: '0.4s' }} />
                </>
              )}
              
              {/* Microphone button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/50'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {isListening ? (
                  <Volume2 className="h-12 w-12 text-white" />
                ) : (
                  <Mic className="h-12 w-12 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="min-h-[120px] bg-muted/50 rounded-lg p-4 border border-border">
            {transcript || interimTranscript ? (
              <div className="space-y-2">
                {transcript && (
                  <p className="text-foreground">
                    {transcript}
                  </p>
                )}
                {interimTranscript && (
                  <p className="text-muted-foreground italic">
                    {interimTranscript}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isListening ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <p>Listening for your voice...</p>
                  </div>
                ) : (
                  <p>Your speech will appear here</p>
                )}
              </div>
            )}
          </div>

          {/* Search Examples */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm mb-2">
              <span className="text-emerald-600 dark:text-emerald-400">💡 Try saying:</span>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "Show me organic vegetables"</li>
              <li>• "I need fresh tomatoes"</li>
              <li>• "Find dairy products on sale"</li>
              <li>• "Search for strawberries"</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSearch}
              disabled={!transcript.trim()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              size="lg"
            >
              Search
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
          </div>

          {/* Instructions */}
          <p className="text-xs text-center text-muted-foreground">
            Tap the microphone and speak clearly. Your browser may ask for microphone permissions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}