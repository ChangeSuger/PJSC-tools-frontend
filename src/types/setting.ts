export type LLMConfig = {
  apiKey: string;

  model: string;

  baseURL: string;
};

export type TTSConfig = {
  baseURL: string;

  /**
   * 每条文本生成的音频数量，考虑音频生成的随机性，建议不小于 3
   */
  batchSize: number;

  /**
   * 切分方式
   */
  sliceMethod: string;

  /**
   * 采样步长，候选值：4、8、16、32
   */
  samplingStep: number;

  /**
   * 语速，候选值范围：0.6-1.65
   */
  speed: number;

  /**
   * 句间停顿秒数，候选值范围：0.1-0.5
   */
  pauseBetweenSentences: number;

  /**
   * 候选值范围：1-100
   */
  topK: number;

  /**
   * 候选值范围：0-1
   */
  topP: number;

  /**
   * 候选值范围：0-1
   */
  temperature: number;
};

export type OSSConfig = {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
};