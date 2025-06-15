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
   * 格式：<character>-<emotion>
   */
  id: string;
  audio: Blob;
  text: string;
}

export type Emotion =
| '默认'
| '开心'
| '生气'
| '难过'
| '吃惊'
| '厌恶'
| '恐惧'

export type TTSGenerateSSEData = {
  code: number,
  url: string,
}
