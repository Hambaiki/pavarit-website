import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";
import { FaLock } from "react-icons/fa";

export default function Login() {
  return (
    <MainContainer className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-8">
        <FaLock className="w-32 h-32" />

        <h1 className="text-4xl font-bold">Login with Auth0</h1>
        <Button href="/api/auth/login" className="w-32 h-12 rounded-full">
          Login
        </Button>
      </div>
    </MainContainer>
  );
}
