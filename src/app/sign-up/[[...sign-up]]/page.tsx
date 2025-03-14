import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="grid h-full pt-12 w-screen place-items-center text-white">
      <SignUp />
    </div>
  );
}
