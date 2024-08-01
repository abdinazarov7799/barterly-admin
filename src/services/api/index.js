import axios from "axios";
import { get } from "lodash";
import NProgress from "nprogress";
import storage from "../storage";
import config from "../../config";
import Swal from "sweetalert2";

NProgress.configure({
  showSpinner: true,
  trickleRate: 0.02,
  trickleSpeed: 400,
  easing: "ease",
  speed: 200,
});


const request = axios.create({
  baseURL: config.API_ROOT,
  params: {},
});

request.interceptors.request.use(
  (requestConfig) => {
    NProgress.inc();
    const token = get(JSON.parse(storage.get("settings")), "state.token", null);
      requestConfig.headers['Accept-Language'] = storage.get("lang") || config.DEFAULT_APP_LANG;
      if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
    return requestConfig;
  },
  (error) => {
    NProgress.done(true);
  }
);

request.interceptors.response.use(
  (response) => {
    NProgress.done(true);
    return response;
  },
  (error) => {
    const statusCode = error.response.status;
    if (statusCode === 401) {
        Swal.fire({
          position: "center",
          icon: "error",
          backdrop: "rgba(0,0,0,0.9)",
          background: "none",
          title: "Tokeningiz faol emas. Iltimos tizimga qayta kiring !!! ",
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#13D6D1",
          confirmButtonText: "Chiqish",
          customClass: {
            title: "title-color",
          },
        }).then((result) => {
          window.localStorage.clear();
          window.location.reload();
        });
    }
    NProgress.done(true);
    return Promise.reject(error);
  }
);

export { request };
