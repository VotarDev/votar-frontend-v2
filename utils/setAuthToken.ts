import httpService from "./axios";

const setAuthToken = (token: any) => {
  if (token) {
    httpService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete httpService.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
