import type { Emotion } from "./tts";

type SystemContent = {
  type: string;
  src: string;
  content: string | Record<'cid' | 'exp', string>;
}

export type ScriptTypeMap = {
  /**
   * 背景、特效等控制
   */
  systems: {
    type: 'systems';
    contents: Array<SystemContent>;
  },

  /**
   * 注释
   */
  comment: {
    type: 'comment';
    src: string;
    content: string;
  },

  /**
   * 线性剧本演出
   */
  line: {
    type: 'line';

    /**
     * 背景
     */
    bg: string;

    /**
     * 唯一标识符，格式是 <section_name>:<number>，但是没看懂为什么会有不连续的部分，虽然不影响处理
     */
    src: string;

    /**
     * 唯一标识符，每个 Section 重新计数
     */
    id: string;

    /**
     * 角色名
     */
    cid: string;

    /**
     * 文本
     */
    line: string;

    /**
     * 角色别名，显示优先级高于 cid
     */
    alias?: string;

    /**
     * 角色表情控制
     */
    charas: Record<string, string>;
  }
};

export type StoryScript = Array<
  ScriptTypeMap[keyof ScriptTypeMap]
>;

export type StoryItem = ScriptTypeMap['line'] & {
  /**
   * 日文文本
   */
  lineJP: string;

  /**
   * 情感
   */
  emotion: Emotion;

  /**
   * 中文音频资源 URL
   */
  cnAudioURL: string;

  /**
   * 备选中文音频资源 URL
   */
  cnAudioURLs: string[];

  /**
   * 日文音频资源 URL
   */
  jpAudioURL: string;

  /**
   * 备选日文音频资源 URL
   */
  jpAudioURLs: string[];
}

export type StoryScriptFull = Array<
  | ScriptTypeMap['systems']
  | ScriptTypeMap['comment']
  | StoryItem
>