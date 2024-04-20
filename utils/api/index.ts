import httpService from "../axios";

const signupurl = "/auth/signup";
const signinurl = "/auth/login";
const googleUrl = "/auth/google";
const mediumUrl =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@votarhq";
const freeElectionUrl = "/election/free";
const usersUrl = "/user/get-profile";
const updateUserUrl = "/user/profile-update";
const emailUpdateUrl = "/user/verify-email";
const googleAuthUrl = "/auth/google";

export const signup = (data: any) => {
  return httpService.post(signupurl, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const singin = (data: { email: string; password: string }) => {
  return httpService.post(signinurl, data);
};

export const googleAuth = () => {
  return httpService.get(googleUrl);
};

export const getPost = () => {
  return httpService.get(mediumUrl);
};
export const getUserData = (id: string) => {
  return httpService.get(usersUrl + "/" + id);
};

export const createFreeElection = (data: any) => {
  return httpService.post(freeElectionUrl, data);
};

export const updateProfile = (data: any, id: any) => {
  return httpService.put(updateUserUrl + `/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const verifyEmail = (data: any) => {
  return httpService.post(emailUpdateUrl, data);
};

export const googleAuthentication = (data: any) => {
  return httpService.get(googleAuthUrl, data);
};
