import React, { useState } from "react";
import logo from "../../assets/ibm-logo.svg";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../../lib/utils/types.ts";

interface FormState {
  email: string;
}

interface SignInFormProps {
  supabase: SupabaseClient<Database>;
  domain_url: string;
}

export const ForgotForm: React.FC<SignInFormProps> = ({
  supabase,
  domain_url,
}) => {
  const initialFormState: FormState = {
    email: "",
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    const url = `${window.location.origin}/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      {
        redirectTo: url,
      }
    );
    try {
      if (error) {
        setErrorMessage(error.message);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      } else {
        setShowMessage(true);
        setMessage("Reset link sent to your email. If the provided email is registered in our database, then you should receive the link very soon.");
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update the corresponding property in the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-sm rounded-lg shadow-lg bg-white p-6 space-y-6  dark:border-gray-700  ">
      <div className="space-y-2 text-center justify-center items-center ">
        <h1 className="text-3xl font-bold">Forgot Password</h1>

        <p className="text-zinc-500 dark:text-zinc-400">
          Enter your email so we can send you a reset link
        </p>
      </div>
      <div className="items-center justify-center">
        <img
          src={logo}
          alt="IBM Logo"
          className="block mx-auto w-24 object-cover"
        />
      </div>
      <form>
        <div>
          <label htmlFor="email" className="block text-black font-medium mb-2 ">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email || ""}
            className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            onChange={handleInputChange}
          />
        </div>
        <button
          className="w-full border-2 border-black hover:bg-black text-black hover:text-white p-2 rounded transition duration-300 mt-5"
          onClick={handleSubmit}
        >
          Reset
        </button>
      </form>
      {showMessage && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800">
          {message}
        </div>
      )}
      {showError && (
        <div className="bg-red-200 p-3 mb-3 rounded-md text-red-800 mt-6">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
