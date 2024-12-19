import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const startListening = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support Speech Recognition.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true; // Keep listening continuously


    recognition.onresult = (event) => {
      const transcriptArray = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(transcriptArray);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart recognition automatically if listening
      } else {
        setIsListening(false);
      }
    };

    recognition.start();
    setIsListening(true);
    setRecognitionInstance(recognition);
  };

  const stopListening = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setRecognitionInstance(null);
    }
    setIsListening(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Judicial Speech Interpretation Application</h1>
      </header>
      <main>
        <button onClick={startListening} disabled={isListening}>
          {isListening ? 'Listening...' : 'Start Listening'}
        </button>
        <button onClick={stopListening} disabled={!isListening}>
          Stop Listening
        </button>
        <p><strong>Transcript:</strong> {transcript}</p>
      </main>
    </div>
  );
};

export default App;