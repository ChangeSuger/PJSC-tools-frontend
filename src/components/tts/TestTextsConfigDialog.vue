<template>
  <a-tooltip content="设置测试文本">
    <a-button
      type="text"
      @click="open"
    >
      <template #icon>
        <IconSettings />
      </template>
    </a-button>
  </a-tooltip>

  <a-modal
    body-class="p-4!"
    v-model:visible="visible"
    width="40%"
    title="测试文本配置"
  >
    <div class="w-full flex flex-col gap-2">
      <template
        v-for="(emotionText, index) of testTexts"
        :key="`${emotionText[0]}-${index}`"
      >
        <div class="w-full h-10 flex gap-6 items-center">
          <div class="pb-1">
            <EmotionTag v-model:text="emotionText[0]" can-edit-emotion />
          </div>
          <a-typography class="w-full *:mb-0!">
            <a-typography-paragraph
              class="h-[27px]!"
              editable
              :ellipsis="{ row: 1, showTooltip: true }"
              v-model:editText="emotionText[1]"
            >
              {{ emotionText[1] }}
            </a-typography-paragraph>
          </a-typography>
        </div>
      </template>

      <a-button type="primary" @click="addTestText">新增测试文本</a-button>
    </div>

    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { useTTSModelStore } from '@/stores';
import { ref } from 'vue';
import EmotionTag from '@/components/common/EmotionTag.vue';
import { cloneDeep } from 'lodash-es';
import { IconSettings } from '@arco-design/web-vue/es/icon';

const ttsModelStore = useTTSModelStore();

const visible = ref(false);
const testTexts = ref(cloneDeep(ttsModelStore.emotionTexts));

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

function handleConfirm() {
  ttsModelStore.setEmotionTexts(testTexts.value);
  close();
}

function addTestText() {
  testTexts.value.push([
    '中立',
    ''
  ])
};
</script>
