import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="grid h-full pt-24 w-screen place-items-center text-white">
      <SignIn />
    </div>
  );
}
