<template>
  <el-dialog v-model="visible" append-to-body center width="80%" title="提示词设置">
    <el-form v-model="translateSystemMessageForm">
      <el-form-item
        class="*:flex *:flex-row *:gap-2 *:items-start!"
        v-for="(item, index) of translateSystemMessageForm"
        :key="index"
      >
        <el-input
          class="w-50"
          v-model="item.character"
          :disabled="item.character === 'default'"
        />

        <el-input class="w-full" type="textarea" autosize v-model="item.systemMessage" />

        <div class="w-12.5">
          <el-button
            v-if="item.character !== 'default'"
            type="danger"
            plain
            :icon="Delete"
            @click="deleteTranslateSystemMessageItem(index)"
          ></el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-button type="primary" plain @click="addTranslateSystemMessageItem">添加配置</el-button>

    <template #footer>
      <el-button type="primary" plain @click="saveTranslateSystemMessageForm">保存</el-button>
      <el-button type="info" plain @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTranslataStore } from '@/stores';
import { cloneDeep } from 'lodash-es';

import type { TranslateSystemMessageItem } from '@/types';

import { Delete } from '@element-plus/icons-vue';

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
