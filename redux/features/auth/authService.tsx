import httpService from "@/utils/axios";
import setAuthToken from "@/utils/setAuthToken";

const signinurl = "/user/login";
const signupurl = "/user/signup";

const login = (data: any) => {
  return httpService.post(signinurl, data);
};
const signup = (data: any) => {
  return httpService.post(signupurl, data);
};
const logout = () => {
  localStorage.removeItem("user");
  setAuthToken(null);
};

const authService = { login, logout, signup };
export default authService;
