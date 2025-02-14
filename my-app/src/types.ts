export type ModelType = 'ASR' | 'NMT' | 'TTS';

export interface LanguageData {
  id: string;
  name: string;
  iso_code?: string;
  glottocode?: string;
  family_name?: string;
  family_id?: string;
  subfamily_name?: string;
  subfamily_id?: string;
  asr: boolean;
  nmt: boolean;
  tts: boolean;
  asr_url?: string;
  nmt_url?: string;
  tts_url?: string;
  latitude: number;
  longitude: number;
  available_models: ModelType[];
  nmt_pair_count: number;
  connected_languages?: { name: string; id: string }[];
}

export interface TranslationPair {
  source_lang_id: string;
  target_lang_id: string;
  source_lang_name: string;
  target_lang_name: string;
  chrf_score: number;
  bleu_score: number;
  model_url?: string;
}
