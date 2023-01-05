import { AxiosError } from "axios";
import { ComponentInternalInstance } from 'vue'

export const axiosErrorHandler = (instance: ComponentInternalInstance, error: AxiosError) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    instance?.proxy?.$toast.error(error.response.data)
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log("Error", error.message);
  }
  console.log(error.config);
};