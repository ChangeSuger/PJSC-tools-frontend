import { useAudioDBStore, useSettingsStore, useTTSCharacterStore, useTTSModelStore } from "@/stores";
import type { ExampleAudioObject, StoryItem, TTSGenerateSSEData } from "@/types";
import { DEFAULT_EMOTION_CLASS } from '@/datas';
import { Message } from "@arco-design/web-vue";
import { CommonApi } from "@/api";

/**
 * 参考音频兜底策略：情感标签的参考音频 > 情感分类的参考音频 > 默认的参考音频
 * @param cid
 * @param emotion
 */
export async function getExampleAudio(
  cid: string,
  emotion: string,
): Promise<ExampleAudioObject | null> {
  const exampleAudioDB = useAudioDBStore().getExampleAudioDB;
  const emotionMap = useTTSCharacterStore().getEmotionMap;

  let exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-${emotion}`);

  if (!exampleAudio) {
    const emotionClass = emotionMap[emotion];

    if (emotionClass) {
      exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-${emotionClass}`);
    }

    if (exampleAudio && emotionClass !== '中立') {
      exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-${DEFAULT_EMOTION_CLASS}`);
    }
  }

  return exampleAudio;
}


export async function ttsBatchGenerateJP(
  item: Pick<StoryItem, 'id' | 'cid' | 'lineJP' | 'emotion'>,
  scriptName: string,
  onSSEProcess: (data: TTSGenerateSSEData) => void,
  batchSize: number = useSettingsStore().ttsConfig.batchSize,
  gptModel?: string,
  sovitsModel?: string,
) {
  const { id, cid, lineJP, emotion } = item;

  const settingsStore = useSettingsStore();
  const ttsCharacterStore = useTTSCharacterStore();


  const ttsConfigDefault = settingsStore.getTTSConfig;
  const ossConfig = settingsStore.getOSSConfig;

  const ttsConfig = {
    ...ttsConfigDefault,
    ...ttsCharacterStore.ttsCharacterConfigMap[cid]
  };

  if (!(gptModel && sovitsModel)) {
    const modelConfig = ttsCharacterStore.getModelByCharacterAndEmotion(cid, emotion);

    if (!modelConfig) {
      Message.error('未找到该角色的模型配置，请在配置角色模型后重试。');
      return;
    }

    gptModel = modelConfig.gptModel;
    sovitsModel = modelConfig.sovitsModel;
  }

  const changeModelResult = await useTTSModelStore().changeModel(sovitsModel!, gptModel!);

  if (!changeModelResult) {
    Message.error('切换模型失败，音频生成任务停止。');
    return;
  }

  const exampleAudio = await getExampleAudio(cid, emotion);

  if (!exampleAudio) {
    Message.error('未找到合适的参考音频，请在设置参考音频后重试。');
    return;
  }

  const formData = new FormData();
  formData.append('ttsConfig', JSON.stringify({
    ...ttsConfig,
    batchSize,
  }));
  formData.append('ossConfig', JSON.stringify(ossConfig));
  formData.append('exampleAudio', exampleAudio!.audio);
  formData.append('exampleText', JSON.stringify({
    text: exampleAudio!.text,
    lang: '日文',
  }));
  formData.append('targetText', JSON.stringify({
    text: lineJP,
    id: generateAudioID(id, scriptName, 'jp'),
    lang: '日文',
  }));

  const res = await CommonApi.ttsBatchGenerate(formData);

  if (res.code === 200) {
    const eventSource = new EventSource('/api/tts-sse');

    await new Promise((res, rej) => {
      eventSource.onmessage = (event) => {
        const progressData: TTSGenerateSSEData = JSON.parse(event.data);

        if (progressData.code === 2) {
          console.log('TTS End');
          eventSource.close();
          res('');
        } else if (progressData.code === 0) {
          console.log('TTS Start')
        } else if (progressData.code === 1) {
          onSSEProcess(progressData);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Failed', error);
        rej();
      }
    });
  }
}

function generateAudioID(id: string, scriptName: string, lang: 'jp' | 'cn'): string {
  return `${scriptName}_${id}_${lang}_${Date.now()}`;
}
