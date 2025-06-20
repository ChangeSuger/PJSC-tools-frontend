import type { TTSConfig } from "./setting";

export type TTSCharacterConfig = Pick<
  TTSConfig,
  | 'sliceMethod'
  | 'samplingStep'
  | 'speed'
  | 'pauseBetweenSentences'
  | 'topK'
  | 'topP'
  | 'temperature'
>

export type ExampleAudioObject = {
  /**
   * 格式：<character_name>-<emotion>
   */
  id: string;
  audio: Blob;
  text: string;
}

/**
 * 情感分类，共 9 种
 */
export type Emotion =
| '中立'
| '开心'
| '生气'
| '难过'
| '紧张'
| '担忧'
| '疑惑'
| '恐惧'
| '吃惊'

export type TTSGenerateSSEData = {
  code: number,
  url: string,
}
