import type { EvaluationCriterion } from './types'

export const sampleEvaluationCriteria: EvaluationCriterion[] = [
  {
    id: 'criterion-1',
    text: 'Kandidát má alespoň tři roky praxe v oblasti prodeje B2B služeb, zkušenost s vedením obchodních jednání na úrovni top managementu a prokazatelné výsledky v dosahování obchodních cílů.',
    priority: 'high',
  },
  {
    id: 'criterion-2',
    text: 'Znalost angličtiny na komunikativní úrovni.',
    priority: 'low',
  },
]

/** Five high and five lower priority criteria, deliberately interleaved to show the grouping. */
export const sampleGroupedEvaluationCriteria: EvaluationCriterion[] = [
  { id: 'g-1', text: 'Alespoň tři roky praxe v prodeji B2B služeb.', priority: 'high' },
  { id: 'g-2', text: 'Znalost angličtiny na komunikativní úrovni.', priority: 'low' },
  {
    id: 'g-3',
    text: 'Zkušenost s vedením obchodních jednání na úrovni top managementu.',
    priority: 'high',
  },
  { id: 'g-4', text: 'Praxe s prací v CRM systému.', priority: 'low' },
  {
    id: 'g-5',
    text: 'Prokazatelné výsledky v dosahování obchodních cílů.',
    priority: 'high',
  },
  {
    id: 'g-6',
    text: 'Zkušenost s prezentací nabídek před větším publikem.',
    priority: 'low',
  },
  { id: 'g-7', text: 'Zkušenost s vyjednáváním cen a obchodních podmínek.', priority: 'high' },
  { id: 'g-8', text: 'Znalost trhu IT nebo softwarových služeb.', priority: 'low' },
  {
    id: 'g-9',
    text: 'Schopnost budovat dlouhodobé vztahy s klíčovými zákazníky.',
    priority: 'high',
  },
  { id: 'g-10', text: 'Ochota příležitostně cestovat za zákazníky.', priority: 'low' },
]
