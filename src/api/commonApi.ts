import {
  axiosInstance,
  successWrapper,
  type Response,
} from '@/api/axiosInstance';

import type { TranslateBody, GetChoicesResponse, ChangeModelRequest } from '@/types';

export class CommonApi {
  static async translate(data: TranslateBody) {
    try {
      const res = await axiosInstance.post<Response<string>>('/translate', data);
      return successWrapper(res.data.data);
    } catch(error) {
      console.log(error);

      return {
        code: 500,
        msg: '网络错误'
      } as Response<string>;
    }
  }

  static async ttsBatchGenerate(data: FormData) {
    try {
      const res = await axiosInstance.post<Response<string>>('/tts', data);
      return successWrapper(res.data.data);
    } catch(error) {
      console.log(error);

      return {
        code: 500,
        msg: '网络错误'
      } as Response<string>;
    }
  }

  static async getChoices(url: string) {
    try {
      const res = await axiosInstance.post<Response<GetChoicesResponse>>('/change_choices', { url });
      return successWrapper(res.data.data);
    } catch(error) {
      console.log(error);

      return {
        code: 500,
        msg: '网络错误'
      } as Response<GetChoicesResponse>;
    }
  }

  static async changeModel(data: ChangeModelRequest) {
    try {
      const res = await axiosInstance.post<Response<string>>('/change_model', data);
      return successWrapper(res.data.data);
    } catch(error) {
      console.log(error);

      return {
        code: 500,
        msg: '网络错误'
      } as Response<string>;
    }
  }
}
