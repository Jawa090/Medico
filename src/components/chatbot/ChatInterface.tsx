
import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Stethoscope, Mic, MicOff, Bot, User, X, Clock, Info, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface HealthRecord {
  id: string;
  date: Date;
  medicationName: string;
  notes: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your health assistant. How can I help you today? You can ask me about health advice or any questions you have.",
    sender: 'bot',
    timestamp: new Date(),
  },
];

interface ChatInterfaceProps {
  className?: string;
}

const healthTopics = [
  "How to manage stress?",
  "Tips for better sleep",
  "What foods boost immunity?",
  "Common cold remedies"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Use RapidAPI Findzebra API for health information
    try {
      const response = await getMedicineInfo(input);
      
      setTimeout(() => {
        let responseText = response || "I'm a demo health assistant, so please consult with a healthcare professional for personalized advice.";
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting response:", error);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I couldn't process your request at this time. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const getMedicineInfo = async (query: string): Promise<string> => {
    try {
      // Mock API response for medicine information
      const responses = [
        "Based on health guidelines, it's recommended to maintain a balanced diet and regular exercise for this condition.",
        "Many healthcare professionals suggest that adequate hydration and rest can help with these symptoms.",
        "According to medical research, there are several approaches to managing this. First, maintain a healthy lifestyle with regular exercise and a balanced diet. Second, ensure you're getting enough sleep.",
        "I'd recommend consulting with your doctor, but generally this kind of health concern can be addressed with lifestyle changes.",
        "From a healthcare perspective, it's important to note that these symptoms should be monitored closely."
      ];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a random response
      return responses[Math.floor(Math.random() * responses.length)] + 
             " Remember to consult with a healthcare professional for personalized medical advice.";
    } catch (error) {
      console.error("Error getting medicine information:", error);
      return "I couldn't find specific information about that. Please consult with a healthcare professional for accurate advice.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.info('Listening...', { duration: 1000 });
    };
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast.error('Error recognizing speech. Please try again.');
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (topic: string) => {
    setInput(topic);
  };

  return (
    <div className={cn("flex flex-col h-full chat-container", className)}>
      <div className="bg-gradient-to-r from-teal-100/80 to-blue-100/50 dark:from-teal-900/30 dark:to-blue-900/20 rounded-t-xl p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="text-teal-600 dark:text-teal-400 mr-2 h-5 w-5" />
          <h2 className="font-medium text-foreground">Health Assistant</h2>
        </div>
        <div className="flex items-center space-x-1">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full bg-teal-100/50 dark:bg-teal-800/30"
          >
            <Info className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </motion.div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white/80 to-gray-50/60 dark:from-gray-900/80 dark:to-gray-950/60">
        {/* Welcome message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-4 relative dark:bg-teal-900/20 dark:border-teal-800/30"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 text-teal-500"
                onClick={() => setShowWelcome(false)}
              >
                <X className="h-4 w-4" />
              </motion.button>
              <div className="flex items-start">
                <Stethoscope className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-teal-800 dark:text-teal-200">Welcome to your AI Health Assistant</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-300 mt-1">
                    Ask me about health advice or any questions you have. I'm here to help with your health journey.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                stiffness: 100,
                damping: 15
              }}
              className={cn(
                "mb-4 max-w-[85%] md:max-w-[75%]",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800/50 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "rounded-2xl p-3 shadow-sm",
                    message.sender === 'user'
                      ? "chat-message-user rounded-tr-none"
                      : "chat-message-bot rounded-tl-none"
                  )}
                >
                  <p className="leading-relaxed text-sm md:text-base">{message.text}</p>
                  {message.sender === 'bot' && (
                    <motion.div 
                      className="flex mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Heart className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400 mr-1" />
                      <span className="text-xs text-teal-600 dark:text-teal-400">Health tip</span>
                    </motion.div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <p className={cn(
                "text-xs text-muted-foreground mt-1",
                message.sender === 'user' ? "text-right mr-10" : "ml-10"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 max-w-[85%] md:max-w-[75%]"
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800/50 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                </div>
                <div className="chat-message-bot rounded-2xl rounded-tl-none p-3">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </div>
      
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested topics:</p>
          <div className="flex flex-wrap gap-2">
            {healthTopics.map((topic) => (
              <motion.div 
                key={topic}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-teal-50/70 border-teal-100 text-xs shadow-sm dark:bg-teal-900/20 dark:border-teal-800/30 dark:text-teal-200"
                  onClick={() => handleSuggestionClick(topic)}
                >
                  {topic}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border-t p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-xl">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-full overflow-hidden pr-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your health concerns..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            className="p-2 rounded-full text-teal-600 dark:text-teal-400 mr-1"
          >
            {isListening ? 
              <MicOff className="w-5 h-5 text-red-500" /> : 
              <Mic className="w-5 h-5" />
            }
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "p-2 rounded-full",
              input.trim() ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"
            )}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
