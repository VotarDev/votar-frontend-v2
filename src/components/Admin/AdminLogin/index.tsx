import React, { FormEvent, useEffect, useState } from "react";
import logo from "../../../../public/assets/logos/votar-logo.svg";
import Cookies from "universal-cookie";
import { adminLogin } from "@/utils/api";
import { useDispatch } from "react-redux";
import { setAdminData } from "@/redux/features/adminProfile/adminProfileSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import FormField from "@/src/components/shared/form/FormField";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Sent here because the admin session ran out.
  useEffect(() => {
    if (router.query.expired) {
      toast.error("Your session has expired. Please sign in again.", {
        id: "admin-session-expired",
      });
    }
  }, [router.query.expired]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Enter your username and password");
      return;
    }
    const cookies = new Cookies();
    setLoading(true);
    try {
      const { data } = await adminLogin({ username: username.trim(), password });
      if (data) {
        cookies.set("admin-token", data.data.token, {
          path: "/",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        dispatch(setAdminData(data.data));
        toast.success("Login successful");
        router.push("/admin");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src={logo.src} alt="Votar" className="h-10 w-auto" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Admin console
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm smm:p-8">
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            For Votar administrators only.
          </p>
          <form className="mt-6 space-y-5" onSubmit={handleLogin} noValidate>
            <FormField label="Username" htmlFor="admin-username">
              <Input
                id="admin-username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormField>
            <FormField label="Password" htmlFor="admin-password">
              <div className="relative">
                <Input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
