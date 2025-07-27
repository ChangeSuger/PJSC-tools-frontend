<template>
  <a-space fill wrap>
    <a-tag
      v-for="(emotion, index) of emotions"
      :key="emotion"
      :color="getEmotionColor(emotion)"
      closable
      @close="deleteEmotionConfirm(emotionClass, emotion, index)"
    >
      {{ emotion }}
    </a-tag>

    <a-input
      v-if="inputVisible"
      ref="inputRef"
      :style="{ width: '110px'}"
      size="mini"
      v-model.trim="inputVal"
      @keyup.enter="handleAdd"
      @blur="handleAdd"
    />
    <a-tag
      v-else
      @click="showAddEmotionInput"
    >
      <template #icon>
        <IconPlus />
      </template>
      新增感情标签
    </a-tag>
  </a-space>
</template>

<script setup lang="ts">
import { ref, type PropType, nextTick } from 'vue';
import { useTTSCharacterStore } from '@/stores';
import type { EmotionClass } from '@/types';
import { Message, Modal } from '@arco-design/web-vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { getEmotionColor } from '@/utils/getEmotionColor';

const ttsCharacterStore = useTTSCharacterStore();

const props = defineProps({
  emotions: {
    type: Array as PropType<string[]>,
    required: true,
  },
  emotionClass: {
    type: String as PropType<EmotionClass>,
    required: true,
  },
});

const inputVisible = ref(false);
const inputVal = ref('');
const inputRef = ref<HTMLInputElement>();

function deleteEmotionConfirm(
  emotionClass: EmotionClass,
  emotion: string,
  index: number,
) {
  Modal.warning({
    title: '删除情感标签确认',
    content: `确认删除情感标签【${emotionClass}-${emotion}】？`,
    onOk: () => {
      ttsCharacterStore.deleteEmotion(emotionClass, index)
    },
  });
}

function showAddEmotionInput() {
  inputVisible.value = true;

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
}

function handleAdd() {
  const { emotionClass } = props;
  const newEmotion = inputVal.value;

  if (newEmotion) {
    if (ttsCharacterStore.checkEmotionExisted(newEmotion)) {
      Message.error(`情感标签【${newEmotion}】已存在。`);
    } else {
      ttsCharacterStore.addEmotion(emotionClass, newEmotion);
      Message.success('新增感情标签成功~');
      inputVal.value = '';
    }
  }

  inputVisible.value = false;
}
</script>
