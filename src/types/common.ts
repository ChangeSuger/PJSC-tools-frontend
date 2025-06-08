import type { LLMConfig } from "./setting";

export type TranslateBody = {
  config: LLMConfig;
  text: string;
}

export type TranslateResponse = string;