import axios, { Method } from "axios";
import Cookies from "js-cookie";

const apiEndpoint = process.env.ENDPOINT;
export const identityPath = `${process.env.API_PREFIX_IDENTITY}/v1`;
const axiosInstance = axios.create({ baseURL: apiEndpoint });

async function refreshAccessToken() {
  try {
    const refreshToken = Cookies.get("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${apiEndpoint}/${identityPath}/users/refresh_token`,
      { refreshToken, isSystemUser: true }
    );

    const accessToken = response.data.accessToken;

    Cookies.set("access_token", accessToken);
  } catch (error) {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_id");
    localStorage.clear();
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response && error.response.status === 401 && !config._retry) {
      config._retry = true;
      await refreshAccessToken();

      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

const ErrorResponse = (e: any) => {
  return { ...e.response?.data, statusCode: e.response?.status };
};

interface IPramsRequest {
  url: string;
  method: Method;
  headers?: any;
  data?: any;
  params?: any;
  timeout?: number;
}

export async function baseApi<T>({
  url,
  method,
  headers,
  data,
  params,
  timeout,
}: IPramsRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    let lang = localStorage.getItem("locate");
    if (!lang) lang = "vi";
    axiosInstance({
      url: url,
      method,
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
        "x-user-id": Cookies.get("user_id") || "",
        "Accept-language": lang,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        ...headers,
      },
      params,
      data,
      timeout,
    })
      .then(({ data }) => resolve(data))
      .catch((e) => reject(ErrorResponse(e)));
  });
}
