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
  { name: 'translate-check', label: '中译日校对', icon: CollectionTag },
  { name: 'tts', label: '音频生成', icon: Microphone },
  { name: 'tts-check', label: '音频校对', icon: Checked },
  { name: 'setting', label: '设置', icon: Setting },
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