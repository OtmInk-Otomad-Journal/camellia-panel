import axios from "axios";
import { address, port } from "../common/config";

type APIWrapper<T> = {
  code: number;
  msg: string;
  data: T;
};

if (import.meta.env.VITE_IDENTITY == "ADMIN") {
  axios.defaults.baseURL = `${address}:${port}`;
} else {
  axios.defaults.baseURL = import.meta.env.VITE_ONLINE_API_URL;
}

// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";
async function _get<T>(path: string) {
  return await axios.get(path).then((res: any) => {
    const result: APIWrapper<T> = res.data;
    if (result.code != 0) {
      throw Error(
        `Error when fetching data Code=${result.code} Msg=${result.msg}`
      );
    }
    return result.data;
  });
}

async function _post<Ti, To>(path: string, data?: Ti) {
  return await axios.post(path, data).then((res: any) => {
    const result: APIWrapper<To> = res.data;
    if (result.code != 0) {
      throw Error(
        `遇到了错误！状态码是 ${result.code}，回返消息是：${result.msg}`
      );
    }
    return result.data;
  });
}

export function get<T>(path: string) {
  return async () => await _get<T>(path);
}

export function post<Ti, To>(path: string, data: Ti) {
  return async () => await _post<Ti, To>(path, data);
}
