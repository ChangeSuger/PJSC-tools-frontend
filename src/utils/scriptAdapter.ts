import type { ScriptTypeMap, StoryItem, StoryScript, StoryScriptFull } from "@/types";

import { useTTSCharacterStore } from "@/stores";

function getEmotion(storyItem: ScriptTypeMap['line']): string {
  if (storyItem.charas) {
    const emotion = storyItem.charas[storyItem.cid];
    const emotionList = useTTSCharacterStore().getEmotionList()

    if (emotion && emotionList.includes(emotion)) {
      return emotion;
    }
  }

  return '中立';
}

/**
 * 对导入的 ast 剧本脚本进行预处理，补齐所需成员
 */
export function scriptAdaptIn(storyScript: StoryScript): StoryScriptFull {
  return storyScript.map((storyItem) => {
    if (storyItem.type === 'systems' || storyItem.type === 'comment') {
      return storyItem;
    } else {
      const result: StoryItem = {
        lineJP: '',
        emotion: getEmotion(storyItem),
        cnAudioURL: '',
        cnAudioURLs: [],
        jpAudioURL: '',
        jpAudioURLs: [],
        ...storyItem,
      };

      return result;
    }
  });
}
