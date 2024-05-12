import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const apiUrl = import.meta.env.VITE_API_URL;

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { setNotification } = useApp();
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={ResetPasswordSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
          const response = await axios.post(
            `${apiUrl}/auth/reset-password`,
            values
          );
          setNotification("Check your email for the reset link", "success"); // Assuming a method to set notifications
          resetForm();
          navigate("/signin", { replace: true });
        } catch (error) {
          setNotification(
            "Error sending reset link: " +
              (error.response?.data?.msg || "Unknown error"),
            "error"
          );
          console.error(error);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Form className="p-6 max-w-sm w-full bg-white rounded shadow-md">
            <h1 className="text-lg font-bold text-center mb-6">
              Reset Your Password
            </h1>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ResetPassword;
