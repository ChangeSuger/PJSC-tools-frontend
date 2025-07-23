<template>
  <a-modal v-model:visible="visible" width="80%" title="提示词设置" body-class="py-4!">
    <a-form v-model:model="translateSystemMessageForm" layout="vertical">
      <a-form-item
        class="mb-0!"
        content-class="flex flex-row gap-2 items-start!"
        v-for="(item, index) of translateSystemMessageForm"
        :key="index"
      >
        <a-input
          class="w-50!"
          v-model="item.character"
          placeholder="请输入角色名称"
          :disabled="item.character === 'default'"
        />

        <a-textarea class="w-full" type="textarea" autosize v-model="item.systemMessage" />

        <div class="w-12.5">
          <a-button
            status="danger"
            plain
            :disabled="item.character === 'default'"
            @click="deleteTranslateSystemMessageItem(index)"
          >
            <template #icon>
              <IconDelete />
            </template>
          </a-button>
        </div>
      </a-form-item>
    </a-form>

    <a-button type="primary" plain @click="addTranslateSystemMessageItem">添加配置</a-button>

    <template #footer>
      <a-button type="primary" plain @click="saveTranslateSystemMessageForm">保存</a-button>
      <a-button status="normal" plain @click="close">取消</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTranslataStore } from '@/stores';
import { cloneDeep } from 'lodash-es';

import type { TranslateSystemMessageItem } from '@/types';

import { IconDelete } from '@arco-design/web-vue/es/icon';

defineExpose({
  open,
});

const visible = ref(false);
const translateStore = useTranslataStore();

const translateSystemMessageForm = ref<TranslateSystemMessageItem[]>(
  cloneDeep(translateStore.translateSystemMessageList),
);

function open() {
  translateSystemMessageForm.value = cloneDeep(translateStore.translateSystemMessageList);

  visible.value = true;
}

function close() {
  visible.value = false;
}

function addTranslateSystemMessageItem() {
  translateSystemMessageForm.value.push({
    character: '',
    systemMessage: '',
  });
}

function deleteTranslateSystemMessageItem(index: number) {
  translateSystemMessageForm.value.splice(index, 1);
}

function saveTranslateSystemMessageForm() {
  translateStore.setTranslateSystemMessageList(translateSystemMessageForm.value);
  close();
}
</script>
