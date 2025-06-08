import {
  axiosInstance,
  successWrapper,
  type Response,
} from '@/api/axiosInstance';

import type { TranslateBody } from '@/types';

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
}