// ============================================================================
// Configurable Clinical Rule Engine
// Evaluates medical parameters, intent, and symptoms against dynamic rules
// Output: LOW_PRIORITY | ROUTINE | REVIEW_REQUIRED | URGENT_REVIEW
// ============================================================================

import { ClinicalRule, ClinicalSeverity } from '@/types';
import { mockStore } from '@/lib/supabase/mock-store';

export interface RuleEvaluationResult {
  highestSeverity: ClinicalSeverity;
  matchedRules: Array<{
    ruleId: string;
    ruleName: string;
    category: string;
    severity: ClinicalSeverity;
    action: string;
  }>;
  requiresReview: boolean;
  recommendedAction: string;
}

const SEVERITY_RANK: Record<ClinicalSeverity, number> = {
  LOW_PRIORITY: 1,
  ROUTINE: 2,
  REVIEW_REQUIRED: 3,
  URGENT_REVIEW: 4
};

export function evaluateClinicalRules(context: {
  message?: string;
  symptoms?: string[];
  labValues?: Record<string, number>;
  intent?: string;
}): RuleEvaluationResult {
  const activeRules: ClinicalRule[] = mockStore.clinicalRules.filter(r => r.active);
  const matchedRules: RuleEvaluationResult['matchedRules'] = [];

  let highestSeverity: ClinicalSeverity = 'ROUTINE';
  let recommendedAction = 'Standard outpatient clinical workflow.';

  for (const rule of activeRules) {
    let ruleMatched = false;

    for (const condition of rule.conditions) {
      if (condition.field === 'symptom' && condition.operator === 'contains_any') {
        const textToSearch = [
          context.message || '',
          ...(context.symptoms || [])
        ].join(' ').toLowerCase();

        const hits = (condition.values as string[]).some(val => 
          textToSearch.includes(val.toLowerCase())
        );
        if (hits) ruleMatched = true;
      }

      if (condition.field === 'blood_glucose' && condition.operator === '>') {
        const bg = context.labValues?.['blood_glucose'] || context.labValues?.['fasting_blood_glucose'];
        if (bg !== undefined && bg > Number(condition.values[0])) {
          ruleMatched = true;
        }
      }

      if (condition.field === 'intent' && condition.operator === 'equals') {
        if (context.intent && (condition.values as string[]).includes(context.intent)) {
          ruleMatched = true;
        }
      }
    }

    if (ruleMatched) {
      matchedRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        severity: rule.severity,
        action: rule.action
      });

      if (SEVERITY_RANK[rule.severity] > SEVERITY_RANK[highestSeverity]) {
        highestSeverity = rule.severity;
        recommendedAction = rule.action;
      }
    }
  }

  const requiresReview = SEVERITY_RANK[highestSeverity] >= SEVERITY_RANK['REVIEW_REQUIRED'];

  return {
    highestSeverity,
    matchedRules,
    requiresReview,
    recommendedAction
  };
}
