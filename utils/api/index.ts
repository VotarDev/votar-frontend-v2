import { da } from "date-fns/locale";
import httpService from "../axios";

const signupurl = "/auth/signup";
const signinurl = "/auth/login";
const googleUrl = "/auth/google";
const mediumUrl =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@votarhq";
const freeElectionUrl = "/election/free";
const createElectionUrl = "/user/create-election";
const usersUrl = "/user/get-profile";
const updateUserUrl = "/user/profile-update";
const emailUpdateUrl = "/user/verify-email";
const googleAuthUrl = "/auth/google";
const getElectionIdUrl = "/user/get-electionById";
const createCandidateUrl = "/user/create-candidate";
const createVotarFormsUrl = "/user/create-votar-form";
const testUrlForCreateCandidate =
  "https://f5c2-105-113-61-163.ngrok-free.app/app:v1/user/create-candidate";
const getFormsUrl = "/user/get-allForms";
const votarResponseUrl = "/voter/voter-response";
const getElectionsUrl = "user/get-elections";
const getResponseUrl = "/user/get-electionForm";

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
export const createElection = (data: any, id: string) => {
  return httpService.post(createElectionUrl + `/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createCandidate = (data: any, id: string) => {
  return httpService.post(createCandidateUrl + `/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getElectionById = (data: any, id: string) => {
  return httpService.post(getElectionIdUrl + `/${id}`, data);
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

export const createVotarForms = (data: any, id: string) => {
  return httpService.post(createVotarFormsUrl + `/${id}`, data);
};

export const votarResponse = (data: any, token: string) => {
  return httpService.post(votarResponseUrl, data, { params: { token } });
};

export const getForms = (id: string) => {
  return httpService.get(getFormsUrl + `/${id}`);
};

export const createTestCandidate = (data: any) => {
  return httpService.post(testUrlForCreateCandidate, data);
};

export const getElections = (id: string) => {
  return httpService.get(getElectionsUrl + `/${id}`);
};

export const getVoterResponse = (id: string, data: any) => {
  return httpService.post(getResponseUrl + `/${id}`, data);
};
