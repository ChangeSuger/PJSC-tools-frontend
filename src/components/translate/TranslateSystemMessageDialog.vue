<template>
  <el-dialog
    v-model="visible"
    append-to-body
    center
    width="80%"
    title="提示词设置"
  >
    <el-form
      v-model="translateSystemMessageForm"
    >
      <el-form-item
        class="translate-form-item"
        v-for="(item, index) of translateSystemMessageForm"
        :key="index"
      >
        <el-input style="width: 200px" v-model="item.charecter" :disabled="item.charecter === 'default'" />

        <el-input style="flex: 1" type="textarea" autosize v-model="item.systemMessage" />

        <div style="width: 50px">
          <el-button
            v-if="item.charecter !== 'default'"
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
  cloneDeep(translateStore.translateSystemMessageList)
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
    charecter: '',
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

<style lang="scss">
.translate-form-item {

  .el-form-item__content {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: start;
  }
}
</style>