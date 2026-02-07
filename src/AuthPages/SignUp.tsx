import PageMeta from "../dashboard/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../dashboard/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up"
        description="Sign Up"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
