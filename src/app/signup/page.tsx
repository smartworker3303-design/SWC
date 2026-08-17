import AuthForm from "../../components/AuthForm";

export const metadata = {
  title: "Create Account | Saleem Watch Center",
};

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <AuthForm type="signup" />
    </div>
  );
}
