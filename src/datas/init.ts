import type {
  LLMConfig,
  TTSConfig,
  OSSConfig,
  TTSCharacterConfig,
  TranslateSystemMessageItem,
} from '@/types';

export const LLM_CONFIG_INIT: LLMConfig = {
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  apiKey: '',
};

export const TTS_CHARACTER_CONFIG_INIT: TTSCharacterConfig = {
  sliceMethod: '凑四句一切',
  samplingStep: 32,
  speed: 1,
  pauseBetweenSentences: 0.3,
  topK: 15,
  topP: 1,
  temperature: 1,
};

export const TTS_CONFIG_INIT: TTSConfig = {
  baseURL: '',
  batchSize: 5,
  ...TTS_CHARACTER_CONFIG_INIT,
};


export const OSS_CONFIG_INIT: OSSConfig = {
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
};

export const TRANSLATE_SYSTEM_MESSAGE_ITEM_DEFAULT: TranslateSystemMessageItem = {
  character: 'default',
  systemMessage: '你是一名专业的中译日翻译家，你的目标是把中文翻译成日文，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。',
};

export const CHARACTERS_INIT = [
  '灯',
  '缘',
  '澪',
  '葵',
];
