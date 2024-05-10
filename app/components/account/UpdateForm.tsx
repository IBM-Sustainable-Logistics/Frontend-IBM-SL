import React, { useState } from "react";
import logo from "../../assets/CALC.svg";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../../lib/utils/types.ts";

interface FormState {
  password: string;
}

interface UpdateFormProps {
  supabase: SupabaseClient<Database>;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({ supabase }) => {
  const initialFormState: FormState = {
    password: "",
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    try {
      if (error) {
        setErrorMessage(error.message);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      } else {
        setShowMessage(true);
        setMessage("You are logged in now");
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
    <div className="max-w-sm rounded-lg shadow-lg bg-white p-6 space-y-6  dark:border-gray-700 ">
      <div className="space-y-2 text-center justify-center items-center ">
        <h1 className="text-3xl font-bold">Update Password</h1>

        <p className="text-zinc-500 dark:text-zinc-400">
          Enter your new password below
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
          <label
            htmlFor="password"
            className="block text-black font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password || ""}
            className="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            onChange={handleInputChange}
          />
        </div>
        <button
          className="w-full border-2 border-black hover:bg-black text-black hover:text-white p-2 rounded transition duration-300 mt-5"
          onClick={handleSubmit}
        >
          Update Password
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
