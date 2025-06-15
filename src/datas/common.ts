import {
  HomeFilled,
  Setting,
  EditPen,
  Microphone,
  Checked,
  CollectionTag,
} from "@element-plus/icons-vue";

import type { Emotion } from "@/types";

export const MENU_LIST = [
  { name: 'home', label: '首页', icon: HomeFilled },
  { name: 'translate', label: '中译日', icon: EditPen },
  { name: 'emotion', label: '情感标注', icon: CollectionTag },
  { name: 'tts', label: '音频生成', icon: Microphone },
  { name: 'tts-check', label: '音频校对', icon: Checked },
  { name: 'setting', label: '设置', icon: Setting },
];

export const EMOTIONS: Emotion[] = [
  '默认',
  '开心',
  '生气',
  '难过',
  '吃惊',
  '厌恶',
  '恐惧',
];