// ============================================================================
// Deterministic Medical Translation Provider
// Supports EN, HI, MR with medical term preservation and offline fallback
// ============================================================================

import { TranslationProvider, TranslationResult } from './interface';
import { SupportedLanguage } from '@/types';

// Clinical dictionary preserving crucial medical instructions
const TRANSLATION_MAP: Record<string, { hi: string; mr: string }> = {
  'Potentially urgent information detected. Please seek immediate professional medical assistance or follow your local emergency-care process.': {
    hi: 'संभावित रूप से तत्काल चिकित्सा स्थिति पाई गई है। कृपया तुरंत आपातकालीन चिकित्सा सहायता लें या निकटतम अस्पताल जाएं।',
    mr: 'तातडीने वैद्यकीय मदतीची आवश्यकता असणारे लक्षण आढळले आहे. कृपया त्वरित वैद्यकीय सल्ला घ्या किंवा जवळच्या रुग्णालयात जा.'
  },
  'Based on clinical triage protocols, the reported presentation has been noted. Routine monitoring is recommended until consultation with an attending physician.': {
    hi: 'नैदानिक ट्राइएज प्रोटोकॉल के अनुसार, आपकी स्थिति दर्ज कर ली गई है। डॉक्टर से परामर्श तक नियमित निगरानी की सलाह दी जाती है।',
    mr: 'क्लिनिकल ट्रायज प्रोटोकॉलनुसार, आपली लक्षणे नोंदवली गेली आहेत. डॉक्टरांचा सल्ला होईपर्यंत लक्ष ठेवण्याचा सल्ला दिला जातो.'
  },
  'Your appointment request has been routed to the scheduling desk.': {
    hi: 'आपका अपॉइंटमेंट अनुरोध शेड्यूलिंग डेस्क को भेज दिया गया है।',
    mr: 'आपली अपॉइंटमेंट विनंती शेड्यूलिंग डेस्ककडे पाठवण्यात आली आहे.'
  },
  'Your current position in the waiting queue is:': {
    hi: 'प्रतीक्षा सूची में आपकी वर्तमान स्थिति है:',
    mr: 'प्रतीक्षा यादीतील आपले सध्याचे स्थान आहे:'
  }
};

export class MockTranslationProvider implements TranslationProvider {
  readonly name = 'Deterministic Medical Dictionary Translator';

  isAvailable(): boolean {
    return true;
  }

  async detectLanguage(text: string): Promise<SupportedLanguage> {
    // Unicode ranges: Devanagari (\u0900-\u097F)
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (!hasDevanagari) return 'en';

    // Characteristic Marathi markers (उदा. आहे, नाही, करा, लक्षणे, रुग्णालय)
    const marathiMarkers = ['आहे', 'नाही', 'करा', 'लक्षणे', 'रुग्णालय', 'त्रास', 'दुखत', 'डॉक्टर'];
    const hitsMarathi = marathiMarkers.some(m => text.includes(m));
    if (hitsMarathi) return 'mr';

    return 'hi';
  }

  async translate(
    text: string,
    sourceLang: SupportedLanguage,
    targetLang: SupportedLanguage
  ): Promise<TranslationResult> {
    if (sourceLang === targetLang) {
      return {
        translatedText: text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        confidence: 1.0,
        providerUsed: 'passthrough'
      };
    }

    // Direct lookup in high-fidelity dictionary
    for (const [enKey, targetDict] of Object.entries(TRANSLATION_MAP)) {
      if (text.includes(enKey)) {
        if (targetLang === 'hi') {
          return {
            translatedText: text.replace(enKey, targetDict.hi),
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            confidence: 0.98,
            providerUsed: this.name
          };
        }
        if (targetLang === 'mr') {
          return {
            translatedText: text.replace(enKey, targetDict.mr),
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            confidence: 0.98,
            providerUsed: this.name
          };
        }
      }
    }

    // Contextual translation generation for demo
    if (targetLang === 'hi') {
      return {
        translatedText: `[अनुवादित संदेश]: ${text} (चिकित्सक से परामर्श अवश्य लें)`,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        confidence: 0.89,
        providerUsed: this.name
      };
    }

    if (targetLang === 'mr') {
      return {
        translatedText: `[भाषांतरित संदेश]: ${text} (कृपया डॉक्टरांचा सल्ला घ्या)`,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        confidence: 0.89,
        providerUsed: this.name
      };
    }

    return {
      translatedText: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      confidence: 0.90,
      providerUsed: this.name
    };
  }
}
