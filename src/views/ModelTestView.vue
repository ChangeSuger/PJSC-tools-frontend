<template>
  <div class="w-full h-full flex flex-col pl-2.5 gap-2">
    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div class="flex gap-4">
        <a-input-number
          class="w-25!"
          v-model="form.batch"
          mode="button"
          :step="1"
          :min="3"
          :max="9"
        />

        <a-select
          class="w-30!"
          v-model="form.character"
          allow-clear
          allow-search
          placeholder="选择角色"
          :options="characterOptions"
        />

        <a-select
          class="w-100!"
          v-model="form.sovitsModels"
          :options="ttsModelStore.getSovitsOptions"
          allow-clear
          allow-search
          multiple
          :max-tag-count="1"
        />

        <a-select
          class="w-100!"
          v-model="form.gptModels"
          :options="ttsModelStore.getGptOptions"
          allow-clear
          allow-search
          multiple
          :max-tag-count="1"
        />
      </div>

      <a-button-group type="text">
        <a-tooltip content="导入数据">
          <a-button @click="importTestResult">
            <template #icon>
              <IconUpload />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip content="导出数据">
          <a-button @click="exportTestResult">
            <template #icon>
              <IconDownload />
            </template>
          </a-button>
        </a-tooltip>

        <TestTextsConfigDialog />

        <a-button
          :loading="generateLoading"
          @click="generateModelTestResult"
        >
          生成测试音频
        </a-button>
      </a-button-group>
    </div>

    <div class="w-[calc(100vw-320px)] h-[calc(100vh-130px)] px-2.5">
      <a-table
        :columns="columns"
        :data="tableData"
        :pagination="false"
        :scroll="{
          y: '100%',
          x: '100%'
        }"
        scrollbar
        table-layout-fixed
      >
        <template
          v-for="item of columns.slice(1)"
          :key="item.slotName"
          #[item.slotName]="{ record }: { record: TableRowData }"
        >
          <template
            v-for="emotionAudios of (record[item.slotName] as TestResult)"
            :key="emotionAudios.emotion"
          >
            <div class="flex gap-2 items-center">
              <div>
                <EmotionTag :text="emotionAudios.emotion" />
              </div>

              <AudioPlayer
                v-for="audio of emotionAudios.audios"
                :key="audio"
                :url="audio"
              />
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTTSCharacterStore, useTTSModelStore } from '@/stores';
import { computed, ref } from 'vue';
import { IconUpload, IconDownload } from '@arco-design/web-vue/es/icon';
import TestTextsConfigDialog from '@/components/tts/TestTextsConfigDialog.vue';
import { ttsBatchGenerateJP } from '@/utils/ttsBatchGenerate';
import type { ModelTestResult } from '@/types';
import { Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue';
import EmotionTag from '@/components/common/EmotionTag.vue';
import AudioPlayer from '@/components/common/AudioPlayer.vue';

type TestResult = ModelTestResult['soviteModels'][0]['results']

type TableRowData = Record<string, TestResult | string>;

const ttsCharacterStore = useTTSCharacterStore();
const ttsModelStore = useTTSModelStore();

const generateLoading = ref(false);

const form = ref<{
  character: string;
  batch: number;
  gptModels: string[];
  sovitsModels: string[];
}>({
  character: '',
  batch: 5,
  gptModels: [],
  sovitsModels: [],
});

const modelTestResult = ref<ModelTestResult[]>([]);

const columns = computed<TableColumnData[]>(() => {
  const firstColumn: TableColumnData = {
    title: 'GPT / SoVITS',
    dataIndex: 'gptModel',
    fixed: 'left',
    width: 150
  };

  if(modelTestResult.value.length) {
    return [firstColumn, ...(modelTestResult.value[0].soviteModels.map((soviteModel) => ({
      title: soviteModel.model,
      slotName: soviteModel.model,
      width: form.value.batch * 50 + 100
    })) ?? [])];
  }

  return []
});

const tableData = computed<TableRowData[]>(() => {
  if(modelTestResult.value.length) {
    return modelTestResult.value.map((gptModelResult) => {
      const data: TableRowData = { gptModel: gptModelResult.gptModel };
      for (const sovitsModelResult of gptModelResult.soviteModels) {
        data[sovitsModelResult.model] = sovitsModelResult.results;
      }
      return data;
    });
  }
  return [];
});

const characterOptions = computed(() => {
  return [ ...ttsCharacterStore.characters ];
});

async function generateModelTestResult() {
  const { character, batch, gptModels, sovitsModels } = form.value;

  if (!character || gptModels.length === 0 || sovitsModels.length === 0) {
    Message.warning('配置不完整，请完善配置后重试。');
    return;
  }

  modelTestResult.value = [];

  for (const gptModel of gptModels) {
    const testResult: ModelTestResult = {
      gptModel,
      soviteModels: [],
    };

    modelTestResult.value.push(testResult);

    for (const sovitsModel of sovitsModels) {
      const sovitsModelResult: ModelTestResult['soviteModels'][0] = {
        model: sovitsModel,
        results: []
      };

      testResult.soviteModels.push(sovitsModelResult);

      for (const emotionText of ttsModelStore.emotionTexts) {
        const [emotion, lineJP] = emotionText;

        const result: ModelTestResult['soviteModels'][0]['results'][0] = {
          emotion,
          audios: [],
        }

        sovitsModelResult.results.push(result);

        await ttsBatchGenerateJP(
          {
            id: emotion,
            cid: character,
            lineJP,
            emotion,
          },
          'model-test',
          (processData) => {
            const { url } = processData;
            if (!result.audios.includes(url)) {
              result.audios.push(url);
            }
          },
          batch,
          gptModel,
          sovitsModel,
        );
      }
    }
  }
}

function importTestResult() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const jsonstring = reader.result as string;
        const jsonData = JSON.parse(jsonstring) as ModelTestResult[];
        modelTestResult.value = jsonData;
      }

      reader.readAsText(file);
    }
  }
  input.click();
}

function exportTestResult() {
  const json = JSON.stringify(modelTestResult.value);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.download = `${form.value.character}-model-test.json`;

  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
