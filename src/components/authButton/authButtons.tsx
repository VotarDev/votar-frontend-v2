import Image from "next/image";
import googleLogo from "@/public/google.png";
import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-12 w-full max-w-[500px] items-center justify-center rounded-lg border border-input bg-white px-6 text-base font-semibold text-foreground shadow-sm transition-colors duration-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
      <span className="ml-4">Continue with Google</span>
    </button>
  );
}
