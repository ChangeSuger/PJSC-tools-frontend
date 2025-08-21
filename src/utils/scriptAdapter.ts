import type { ScriptTypeMap, StoryItem, StoryScript, StoryScriptFull } from "@/types";

function getEmotion(storyItem: ScriptTypeMap['line']): string {
  if (storyItem.charas) {
    const emotion = storyItem.charas[storyItem.cid];

    if (emotion) {
      return emotion;
    }
  }

  return '';
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
        emotion: '中立',
        emotionReference: getEmotion(storyItem),
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
