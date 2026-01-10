import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="AUFT"
        description="Sign in to your AUFT account to access your dashboard and manage your activities."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
