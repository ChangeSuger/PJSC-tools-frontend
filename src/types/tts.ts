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
>;

export type ExampleAudioObject = {
  /**
   * 格式：<character>-<emotion>
   */
  id: string;
  audio: Blob;
  text: string;
}