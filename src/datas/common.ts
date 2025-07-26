import {
  IconHome,
  IconLanguage,
  IconSettings,
  IconCheckSquare,
  IconSubscribed,
  IconMusic,
} from "@arco-design/web-vue/es/icon";

import type { CharacterModelConfig, Emotion, EmotionClass } from "@/types";

export const MENU_LIST = [
  { name: 'home', label: '首页', icon: IconHome },
  { name: 'translate', label: '中译日', icon: IconLanguage },
  { name: 'translate-check', label: '中译日校对', icon: IconSubscribed },
  { name: 'tts', label: '音频生成', icon: IconMusic },
  { name: 'tts-check', label: '音频校对', icon: IconCheckSquare },
  { name: 'setting', label: '设置', icon: IconSettings },
];

export const EMOTIONS: Emotion[] = [
  '中立',
  '开心',
  '生气',
  '难过',
  '紧张',
  '担忧',
  '疑惑',
  '恐惧',
  '吃惊',
];

export const EMOTION_CLASS: EmotionClass[] = [
  '中立',
  '哀伤',
  '喜悦',
  '恐惧',
  '愤怒',
];

export function getCharacterModelConfigInit(): CharacterModelConfig {
  return {
    '中立': {
      sovitsModel: '',
      gptModel: ''
    },
    '哀伤': {
      sovitsModel: '',
      gptModel: ''
    },
    '喜悦': {
      sovitsModel: '',
      gptModel: ''
    },
    '恐惧': {
      sovitsModel: '',
      gptModel: ''
    },
    '愤怒': {
      sovitsModel: '',
      gptModel: ''
    },
  };
}
