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
        <div class="w-full h-10 flex items-center">
          <div class="pb-1 pr-2">
            <a-checkbox v-model="emotionText.enable" :value="true" />
          </div>
          <div class="pb-1 pr-4">
            <EmotionTag v-model:text="emotionText.emotion" can-edit-emotion />
          </div>
          <a-typography class="w-full *:mb-0!">
            <a-typography-paragraph
              class="h-[27px]!"
              editable
              :ellipsis="{ row: 1, showTooltip: true }"
              v-model:editText="emotionText.text"
            >
              {{ emotionText.text }}
            </a-typography-paragraph>
          </a-typography>

          <div class="pb-1">
            <a-button status="danger" @click="deleteTestText(index)">
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
          </div>
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
import { IconSettings, IconDelete } from '@arco-design/web-vue/es/icon';

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
  testTexts.value.push({
    emotion: '中立',
    text: '',
    enable: true,
  });
};

function deleteTestText(index: number) {
  testTexts.value.splice(index, 1);
}
</script>
