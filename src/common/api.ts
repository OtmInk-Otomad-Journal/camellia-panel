import axios from "axios";
import { address, port } from "../common/config";
import jsonp from "jsonp";

type APIWrapper<T> = {
  code: number;
  msg: string;
  data: T;
};

axios.defaults.baseURL = `${address}:${port}`;
// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";
async function _get<T>(path: string) {
  return await axios.get(path).then((res) => {
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
  return await axios.post(path, data).then((res) => {
    const result: APIWrapper<To> = res.data;
    if (result.code != 0) {
      throw Error(
        `Error when fetching data Code=${result.code} Msg=${result.msg}`
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
