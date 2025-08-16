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
export type EmotionClass =
| '中立'
| '喜悦'
| '愤怒'
| '哀伤'
| '恐惧'

export type EmotionConfig = Record<EmotionClass, string[]>

export type TTSGenerateSSEData = {
  code: number,
  url: string,
}

export type GetChoicesResponse = [
  { choices: string[] },
  { choices: string[] }
]

export type ChangeModelRequest = {
  url: string;
  sovitsModel: string;
  gptModel: string;
  originLang: string;
  targetLang: string;
}

export type CharacterModelConfig = Record<
  EmotionClass,
  {
    sovitsModel: string;
    gptModel: string;
  }
>

export type EmotionText = {
  emotion: string;
  text: string;
  enable: boolean;
}

export type ModelTestResult = {
  gptModel: string;
  soviteModels: Array<{
    model: string;
    results: Array<{
      emotion: string;
      audios: string[];
    }>
  }>;
};
