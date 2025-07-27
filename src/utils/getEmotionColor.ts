import { useTTSCharacterStore } from "@/stores";

export function getEmotionColor(emotion: string) {
  const emotionConfig = useTTSCharacterStore().emotionConfig;

  if (
    emotion === '中立' ||
    emotionConfig['中立'].includes(emotion)
  ) {
    return 'gray';
  } else if (
    emotion === '哀伤' ||
    emotionConfig['哀伤'].includes(emotion)
  ) {
    return 'blue';
  } else if (
    emotion === '喜悦' ||
    emotionConfig['喜悦'].includes(emotion)
  ) {
    return 'green';
  } else if (
    emotion === '恐惧' ||
    emotionConfig['恐惧'].includes(emotion)
  ) {
    return 'orange';
  } else if (
    emotion === '愤怒' ||
    emotionConfig['愤怒'].includes(emotion)
  ) {
    return 'red';
  } else {
    return 'gray';
  }
}
