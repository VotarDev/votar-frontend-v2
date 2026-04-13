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
const votarResponseUrl = "/voter/addVoter-response";
const getElectionsUrl = "user/get-elections";
const getResponseUrl = "/user/get-electionForm";
const getUserResponseUrl = "/user/voter-response";

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
const dashboardCardsUrl = "user/cards";
const deleteVoterUrl = "user/delete-voter";
const deleteVoterResponseUrl = "user/delete-voterResponse";
const deleteElectionUrl = "user/delete-election";
const deletePositionUrl = "user/delete-position";
const deleteCandidateUrl = "user/delete-candidate";
const voterVerificationLinkUrl = "/voter/verifyLink";
const forgotPassword = "/user/forget-password";
const verifyForgotPassword = "/user/verify-forgetPassword";
const getImagesUrl = "/getImages";
const addCardUrl = "/user/card_details/add";
const getCardsUrl = "/user/card_details";
const createWalletUrl = "/user/wallet";
const createCreditUrl = "/user/add_credit";
const getCreditUrl = "/user/get_credit";
const registerVoterUrl = "/user/register_freeVoter";
const purchaseVotarCreditUrl = "/user/purchase_voterCredit";
const voteCandidateFreeVote = "/voter/free_vote";
const editVotersUrl = "/user/edit_voter";

/** ADMIN */
const adminLoginUrl = "/admin/login";
const adminVotarPageUrl = "/admin/get-votarPage";

const adminGetAllElectionsUrl = "/admin/getAllElection";
const adminVotarPageByElectionUrl = "/admin/votarPageElection";
const adminGetAllUsersUrl = "/admin/getAllUsers";
const adminPublishElectionUrl = "/admin/publish";
const adminTopUpUrl = "/admin/top-up";

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
export const getUserResponse = (data: any, id: string) => {
  return httpService.post(getUserResponseUrl + `/${id}`, data);
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

export const getUserForm = (id: string) => {
  return httpService.get(getResponseUrl, { params: { id } });
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

export const getVoters = (
  id: string,
  data: any,
  page: string,
  limit: string,
  search?: string,
) => {
  return httpService.post(getVoterUrl + `/${id}`, data, {
    params: { page, limit, search },
  });
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

export const enterFreeVotes = (data: any) => {
  return httpService.post(voteCandidateFreeVote, data);
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

export const voterVerificationLink = (t: string, date: string) => {
  return httpService.get(voterVerificationLinkUrl, { params: { t, date } });
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

export const dashboardCards = (authorId: any) => {
  return httpService.post(dashboardCardsUrl, authorId);
};

export const deleteVoter = (data: { voter_id: string; email: string }) => {
  return httpService.delete(deleteVoterUrl, {
    data: data,
  });
};

export const deleteVoterResponse = (data: {
  voter_id: string;
  email: string;
  election_id: string;
}) => {
  return httpService.delete(deleteVoterResponseUrl, {
    data: data,
  });
};

export const deleteCandidate = (data: {
  election_id: string;
  name_of_position: string;
  candidate_name: string;
}) => {
  return httpService.delete(deleteCandidateUrl, {
    data: data,
  });
};

export const deletePosition = (
  data: { election_id: string; name_of_position: string },
  id: string,
) => {
  return httpService.delete(deletePositionUrl + `/${id}`, { data: data });
};

export const deleteElection = (
  electionId: string,
  data: { election_id: string },
) => {
  return httpService.delete(deleteElectionUrl + `/${electionId}`, {
    data: data,
  });
};

export const forgotPasswordRequest = (data: { email: string }) => {
  return httpService.post(forgotPassword, data);
};

export const verifyForgotPasswordRequest = (data: {
  token: string;
  password?: string;
}) => {
  return httpService.put(verifyForgotPassword, data);
};

export const getImages = (name: string, path: string) => {
  return httpService.get(getImagesUrl, { params: { name, path } });
};

export const addCard = (data: any, id: string) => {
  return httpService.post(addCardUrl + `/${id}`, data);
};

export const getCards = (id: string) => {
  return httpService.get(getCardsUrl + `/${id}`);
};

export const createWallet = (id: string) => {
  return httpService.post(createWalletUrl + `/${id}`);
};

export const createCredit = (data: any, id: string) => {
  return httpService.post(createCreditUrl + `/${id}`, data);
};

export const getCredit = (id: string) => {
  return httpService.get(getCreditUrl + `/${id}`);
};

export const registerVoter = (data: any) => {
  return httpService.post(registerVoterUrl, data);
};

export const purchaseVotarCredit = (data: any) => {
  return httpService.post(purchaseVotarCreditUrl, data);
};

export const editVoter = (data: any) => {
  return httpService.put(editVotersUrl, data);
};

/** ADMIN */
export const getAdminVotarPage = (type?: string) => {
  return httpService.get(adminVotarPageUrl + `/${type}`);
};

export const getAdminVotarElection = (
  type: string,
  page: string,
  limit: string,
) => {
  return httpService.get(adminVotarPageUrl, {
    params: {
      type,
      page,
      limit,
    },
  });
};

export const adminLogin = (data: { username: string; password: string }) => {
  return httpService.post(adminLoginUrl, data);
};

export const getAllElectionsAdmin = (page: string, limit: string) => {
  return httpService.get(adminGetAllElectionsUrl, { params: { page, limit } });
};

export const getVotarPageByElection = (email: string, type: string) => {
  return httpService.get(adminVotarPageByElectionUrl + `/${email}`, {
    params: { type },
  });
};

export const adminGetAllUsers = (
  filter?: string,
  page?: string,
  limit?: string,
  search?: string,
) => {
  return httpService.get(adminGetAllUsersUrl, {
    params: { filter, page, limit, search },
  });
};

export const adminPublishElection = (data: any) => {
  return httpService.post(adminPublishElectionUrl, data);
};

export const adminTopUp = (data: any) => {
  return httpService.post(adminTopUpUrl, data);
};
/** ADMIN */
