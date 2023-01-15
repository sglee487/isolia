import { AxiosError } from "axios";
import { ComponentInternalInstance } from 'vue'

export const axiosErrorHandler = (instance: ComponentInternalInstance, error: AxiosError) => {
  if (error.response) {
    instance?.proxy?.$toast.error(error.message)
    instance?.proxy?.$toast.error(error.response.data.detail)
  } else if (error.request) {
    instance?.proxy?.$toast.error('서버 응답이 없습니다. 잠시 후 다시 시도해주세요.')
  } else {
    instance?.proxy?.$toast.error(error.message)
  }
  console.log(error.config);
};