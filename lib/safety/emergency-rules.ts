// ============================================================================
// Deterministic Emergency & Red-Flag Safety Rules Engine
// Scans for life-threatening symptoms before any LLM processing
// ============================================================================

export interface EmergencyMatch {
  isEmergency: boolean;
  matchedCategory?: string;
  matchedKeywords: string[];
  recommendedAction: string;
  severity: 'URGENT_REVIEW';
}

interface RedFlagCategory {
  category: string;
  keywords: string[];
  action: string;
}

const RED_FLAG_CATEGORIES: RedFlagCategory[] = [
  {
    category: 'Acute Coronary Syndrome & Cardiac Emergency',
    keywords: [
      'chest pain', 'crushing chest', 'heart attack', 'pain radiating to left arm',
      'chest pressure', 'sudden chest tightness', 'radiating to jaw', 'cold sweat and chest pain'
    ],
    action: 'Activate emergency cardiac triage. Advise patient to contact emergency services immediately.'
  },
  {
    category: 'Severe Respiratory Distress',
    keywords: [
      'cannot breathe', 'severe shortness of breath', 'gasping for air',
      'blue lips', 'cyanosis', 'stridor', 'choking', 'suffocating'
    ],
    action: 'Activate acute respiratory protocol. Immediate emergency room attendance warranted.'
  },
  {
    category: 'Acute Neurological Deficit & Stroke Signs',
    keywords: [
      'facial drooping', 'sudden weakness in arm', 'slurred speech', 'sudden loss of vision',
      'sudden numbness on one side', 'loss of consciousness', 'passed out', 'seizure active',
      'unresponsive', 'worst headache of life', 'thunderclap headache'
    ],
    action: 'FAST stroke protocol match. Urgent neurovascular evaluation required immediately.'
  },
  {
    category: 'Severe Anaphylaxis & Systemic Allergic Reaction',
    keywords: [
      'swelling of tongue', 'swollen throat', 'difficulty swallowing and breathing',
      'anaphylaxis', 'injected epinephrine', 'throat closing'
    ],
    action: 'Administer emergency epinephrine if prescribed; summon ambulance immediately.'
  },
  {
    category: 'Severe Uncontrolled Hemorrhage',
    keywords: [
      'severe bleeding', 'spurting blood', 'coughing up large amounts of blood',
      'vomiting dark blood', 'uncontrolled hemorrhage'
    ],
    action: 'Apply direct pressure; transport immediately to the nearest trauma emergency center.'
  }
];

export function evaluateEmergencyRules(inputMessage: string): EmergencyMatch {
  const normalized = inputMessage.toLowerCase();
  const matchedKeywords: string[] = [];
  let matchedCategory: string | undefined;
  let recommendedAction = 'Routine or non-emergent presentation.';

  for (const cat of RED_FLAG_CATEGORIES) {
    const hits = cat.keywords.filter(keyword => normalized.includes(keyword));
    if (hits.length > 0) {
      matchedKeywords.push(...hits);
      matchedCategory = cat.category;
      recommendedAction = cat.action;
      return {
        isEmergency: true,
        matchedCategory,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        recommendedAction,
        severity: 'URGENT_REVIEW'
      };
    }
  }

  return {
    isEmergency: false,
    matchedKeywords: [],
    recommendedAction,
    severity: 'URGENT_REVIEW'
  };
}
