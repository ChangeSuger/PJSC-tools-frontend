import type { Emotion, ScriptTypeMap, StoryItem, StoryScript, StoryScriptFull } from "@/types";

import { EMOTIONS } from "@/datas";

function getEmotion(storyItem: ScriptTypeMap['line']): Emotion {
  if (storyItem.charas) {
    const emotion = storyItem.charas[storyItem.cid];

    if (emotion && EMOTIONS.includes(emotion as Emotion)) {
      return emotion as Emotion;
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