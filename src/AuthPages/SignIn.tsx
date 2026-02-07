import PageMeta from "../dashboard/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../dashboard/components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign in"
        description="sign in"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
