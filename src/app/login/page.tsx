import AuthForm from "../../components/AuthForm";

export const metadata = {
  title: "Client Sign In | Saleem Watch Center",
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <AuthForm type="login" />
    </div>
  );
}
