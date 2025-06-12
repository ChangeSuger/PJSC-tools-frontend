import {
  HomeFilled,
  Setting,
  EditPen,
  Microphone,
  Checked,
  CollectionTag,
} from "@element-plus/icons-vue";

export const MENU_LIST = [
  { name: 'home', label: '首页', icon: HomeFilled },
  { name: 'translate', label: '中译日', icon: EditPen },
  { name: 'emotion', label: '情感标注', icon: CollectionTag },
  { name: 'tts', label: '音频生成', icon: Microphone },
  { name: 'tts-check', label: '音频校对', icon: Checked },
  { name: 'setting', label: '设置', icon: Setting },
];