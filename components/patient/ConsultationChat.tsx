'use client';

// ============================================================================
// Patient Consultation & Voice Intake Chat Component
// Integrates Browser Web Speech API, Multilingual Input, and Live Route Tracing
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SupportedLanguage, OrchestrationResponse } from '@/types';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';
import { ClinicalVerificationBadge } from '@/components/common/ClinicalVerificationBadge';

interface MessageItem {
  id: string;
  sender: 'user' | 'orchestrator';
  text: string;
  translatedText?: string;
  isVoice?: boolean;
  timestamp: string;
  orchestration?: OrchestrationResponse;
}

interface ConsultationChatProps {
  language: SupportedLanguage;
}

export function ConsultationChat({ language }: ConsultationChatProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'orchestrator',
      text: 'Hello. I am the CareOrchestrate Clinical AI Assistant. Please describe your symptoms, ask about appointments, or inquire about clinic waiting times. You can speak or type.',
      translatedText: language === 'hi' 
        ? 'नमस्ते। मैं केयरऑर्केस्ट्रेट क्लिनिकल एआई सहायक हूँ। कृपया अपने लक्षण बताएं या अपॉइंटमेंट के बारे में पूछें।'
        : language === 'mr'
        ? 'नमस्कार. मी केअरऑर्केस्ट्रेट क्लिनिकल एआय सहाय्यक आहे. कृपया आपली लक्षणे सांगा किंवा अपॉइंटमेंटबद्दल विचारा.'
        : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [latestTrace, setLatestTrace] = useState<OrchestrationResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;

        const langMap: Record<SupportedLanguage, string> = {
          en: 'en-US',
          hi: 'hi-IN',
          mr: 'mr-IN'
        };
        recog.lang = langMap[language] || 'en-US';

        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recog.onerror = () => {
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start failed:', err);
      }
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: MessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      isVoice: isListening,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'demo-session-patient-101',
          patientId: '55555555-5555-5555-5555-555555555551',
          inputType: isListening ? 'voice' : 'text',
          message: textToSend,
          language
        })
      });

      const data: OrchestrationResponse = await res.json();
      setLatestTrace(data);

      const assistantMsg: MessageItem = {
        id: `orch-${Date.now()}`,
        sender: 'orchestrator',
        text: data.result.message,
        translatedText: data.result.translatedMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orchestration: data
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to orchestrate request:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'orchestrator',
          text: 'Unable to reach the clinical model orchestrator. Please report directly to the clinic reception.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    { label: 'Chest Tightness (Emergency Test)', text: 'I have severe chest pain radiating to my left arm and shortness of breath.' },
    { label: 'Diabetic Follow-up (Routine)', text: 'I am experiencing mild fatigue and my morning blood sugar has been 170.' },
    { label: 'Book Appointment', text: 'I want to schedule an appointment with a cardiologist tomorrow.' },
    { label: 'Check Queue Wait Time', text: 'What is my current waiting position and estimated wait time?' }
  ];

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Intelligent Clinical Intake & Triage</h3>
            <p className="text-xs text-slate-500">Autonomous routing to specialized models & deterministic rules</p>
          </div>
        </div>

        {/* Live Active Orchestration Step Indicator */}
        {latestTrace && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-md text-xs shadow-2xs">
            <span className="text-slate-500">Selected Model:</span>
            <span className="font-semibold text-sky-700">{latestTrace.selectedModel}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Confidence:</span>
            <span className="font-semibold text-emerald-700">{Math.round(latestTrace.confidence * 100)}%</span>
          </div>
        )}
      </div>

      {/* Quick Demo Scenarios (Prompt Chips) */}
      <div className="bg-slate-50/70 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Try Scenario:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.text)}
            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 rounded-full font-medium transition shrink-0 cursor-pointer shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
              <span>{msg.sender === 'user' ? 'You (Patient)' : 'CareOrchestrator'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.isVoice && <span className="text-sky-600 font-medium">(Voice Input)</span>}
            </div>

            <div
              className={`max-w-2xl rounded-xl p-4 text-sm leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : msg.orchestration?.intent === 'EMERGENCY_FLAG'
                  ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-tl-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none'
              }`}
            >
              {/* Emergency Banner if applicable */}
              {msg.orchestration?.intent === 'EMERGENCY_FLAG' && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-rose-100/90 rounded text-rose-800 text-xs font-bold border border-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  EMERGENCY RED-FLAG TRIGGERED: Escalated to on-call physician
                </div>
              )}

              {/* Message Content (English & Translated if applicable) */}
              <div className="whitespace-pre-line">
                {msg.translatedText ? (
                  <>
                    <p className="font-semibold text-slate-900 mb-1">{msg.translatedText}</p>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-200/80">{msg.text}</p>
                  </>
                ) : (
                  msg.text
                )}
              </div>

              {/* Orchestrator Step Trace Drawer for Judges & Hackathon Visibility */}
              {msg.orchestration && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-700">Orchestration Route:</span>
                    {msg.orchestration.route.map((r, i) => (
                      <span key={i} className="inline-flex items-center text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-mono text-slate-600">
                        {r}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Latency: <strong className="text-slate-700">{msg.orchestration.totalLatencyMs}ms</strong></span>
                    <span>•</span>
                    <span>Confidence: <strong className="text-emerald-700">{Math.round(msg.orchestration.confidence * 100)}%</strong></span>
                    <span>•</span>
                    <span>Severity: <strong className="text-amber-700">{msg.orchestration.severity}</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg w-fit text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>Orchestrator evaluating intent, clinical rules, and optimal model worker...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Voice Controls */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to microphone... speak now'
                : language === 'hi'
                ? 'लक्षण लिखें या बोलें...'
                : language === 'mr'
                ? 'लक्षणे लिहा किंवा बोला...'
                : 'Type your health concern, appointment request, or speak...'
            }
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
              isListening ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
            }`}
          />

          {/* Web Speech API Microphone Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start voice input (Web Speech API)'}
              className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <MedicalDisclaimer compact />
      </div>
    </div>
  );
}
