import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { supabase } from "../../../../lib/supabase";


export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("signupFormData");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("signupFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
    setSuccessMessage("");
  };

  // ------------------------------
  //      HANDLE SUBMIT (SUPABASE)
  // ------------------------------
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    // Form Validation
    const newErrors = {
      fullName: fullName ? "" : "Full name is required",
      email: email ? "" : "Email is required",
      password: password ? "" : "Password is required",
      confirmPassword:
        confirmPassword === password
          ? ""
          : "Password and confirmation do not match",
      general: "",
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // --------------------
      // SUPABASE SIGNUP
      // --------------------
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullName }, // Save Name in user metadata
        },
      });

      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message }));
        return;
      }

      // Success
      setSuccessMessage("Account created successfully! Please check your email to verify.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      localStorage.removeItem("signupFormData");
    } catch (err:any) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || "An error occurred.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
         to="/admin"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500">
            Enter your details to create an account!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* FULL NAME */}
          <div>
            <Label>Full Name*</Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-sm text-error-500">{errors.fullName}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <Label>Email*</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-sm text-error-500">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password*</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
            {errors.password && <p className="text-sm text-error-500">{errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <Label>Confirm Password*</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-error-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* SUCCESS */}
          {successMessage && (
            <div className="text-sm text-green-600">{successMessage}</div>
          )}

          {/* ERROR */}
          {errors.general && (
            <div className="text-sm text-error-500">{errors.general}</div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/signin" className="text-brand-500 hover:text-brand-600">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
