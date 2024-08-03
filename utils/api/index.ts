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
const getFormsUrl = "/user/get-allForms";
const votarResponseUrl = "/voter/voter-response";
const getElectionsUrl = "user/get-elections";
const getResponseUrl = "/user/get-electionForm";
const updateElectionUrl = "/user/update-election";
const sendVoterCredUrl = "/user/send-votersCred";
const setVotersUrl = "/user/set-voters";
const exportVotersUrl = "/user/export-voters";
const getVoterUrl = "/user/get-voters";
const getCandidatesUrl = "/user/get-candidates";
const importCsvUrl = "/user/import-csv";
const updateCandidateUrl = "/user/update-candidate";
const voterLoginUrl = "/voter/login";
const ballotCandidateUrl = "/voter/get-candidates";
const enterVotesUrl = "/voter/vote-candidates";
const monitorVoteUrl = "/user/monitor-totalNumber";
const monitorIndividualNumberUrl = "user/monitor-individualNumber";
const monitorSubGroupUrl = "user/monitor-subgroupTotal";
const monitorIndividualSubGroupUrl = "user/monitor-subgroupIndividual";
const monitorBarChartUrl = "user/monitor-barchartTotal";
const monitorBarChartIndividualUrl = "user/monitor-barchartIndividual";
const monitorTotalLineChartUrl = "user/monitor-linechart";

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

export const getElectionById = (data: any) => {
  return httpService.post(getElectionIdUrl, data);
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

export const getElections = (id: string) => {
  return httpService.get(getElectionsUrl + `/${id}`);
};

export const getVoterResponse = (id: string, data: any) => {
  return httpService.post(getResponseUrl + `/${id}`, data);
};

export const updateElection = (data: any, id: string) => {
  return httpService.put(updateElectionUrl + `/${id}`, data);
};

export const sendVoterCred = (data: any, id: string) => {
  return httpService.post(sendVoterCredUrl + `/${id}`, data);
};

export const setVoters = (data: any, id: string) => {
  return httpService.post(setVotersUrl + `/${id}`, data);
};

export const exportVoters = (data: any, id: string) => {
  return httpService.post(exportVotersUrl + `/${id}`, data);
};

export const getVoters = (id: string, data: any) => {
  return httpService.post(getVoterUrl + `/${id}`, data);
};

export const getCandidates = (id: string, data: any) => {
  return httpService.post(getCandidatesUrl + `/${id}`, data);
};

export const importFromCsv = (id: string, data: any) => {
  return httpService.post(importCsvUrl + `/${id}`, data);
};

export const updateCandidate = (id: string, data: any) => {
  return httpService.put(updateCandidateUrl + `/${id}`, data);
};

export const voterLogin = (data: any) => {
  return httpService.post(voterLoginUrl, data);
};

export const getBallotCandidate = (data: any) => {
  return httpService.post(ballotCandidateUrl, data);
};

export const enterVotes = (data: any) => {
  return httpService.post(enterVotesUrl, data);
};

export const monitorTotalVote = (id: string) => {
  return httpService.get(monitorVoteUrl, { params: { id } });
};

export const monitorInidividualNumber = (id: string) => {
  return httpService.get(monitorIndividualNumberUrl, { params: { id } });
};

export const monitorSubgroup = (id: string) => {
  return httpService.get(monitorSubGroupUrl, { params: { id } });
};

export const monitorIndividualSubgroup = (id: string) => {
  return httpService.get(monitorIndividualSubGroupUrl, { params: { id } });
};

export const monitorBarChart = (id: string) => {
  return httpService.get(monitorBarChartUrl, { params: { id } });
};

export const monitorBarChartIndividual = (id: string) => {
  return httpService.get(monitorBarChartIndividualUrl, { params: { id } });
};

export const monitorTotalLineChart = (id: string) => {
  return httpService.get(monitorTotalLineChartUrl, { params: { id } });
};
