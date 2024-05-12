import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useApp } from "../context/AppContext";

const SignUp = () => {
  const initialValues = {
    name: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    dob: Yup.date().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    mobileNumber: Yup.string().required("Mobile number is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/api/auth/signup", {
        name: values.username,
        email: values.email,
        dob: values.dob,
        password: values.password,
        mobileNumber: values.mobileNumber,
      });
      alert("Signup successful!");
      resetForm();
    } catch (error) {
      alert("Failed to sign up: " + error.response.data.msg);
    }
    setSubmitting(false);
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="w-full max-w-md">
            <div className="relative flex items-center mb-6">
              <Field
                type="text"
                name="name"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Full Name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>

            <div className="relative flex items-center mb-6">
              <Field
                type="date"
                name="dob"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Date of Birth"
              />
              <ErrorMessage
                name="dob"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>

            <div className="relative flex items-center mb-6">
              <Field
                type="email"
                name="email"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Email address"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="relative flex items-center mb-6">
              <Field
                type="mobileNumber"
                name="mobileNumber"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Phone Number"
              />
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="relative flex items-center mb-4">
              <Field
                type="password"
                name="password"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>

            <div className="relative flex items-center mb-6">
              <Field
                type="password"
                name="confirmPassword"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Sign Up
            </button>

            <div className="mt-6 text-center">
              <a
                href="/signin"
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Already have an account?
              </a>
            </div>
          </Form>
        </Formik>
      </div>
    </section>
  );
};

export default SignUp;
