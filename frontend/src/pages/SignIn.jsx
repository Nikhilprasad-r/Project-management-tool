import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const { signIn, apiUrl } = useApp();
  const initialValues = {
    userIdentifier: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object({
    userIdentifier: Yup.string()
      .required("Email or mobile number is required")
      .test(
        "is-email-or-mobile",
        "Enter a valid email or mobile number",
        (value) =>
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ||
          /^[0-9]+$/g.test(value)
      ),
    password: Yup.string().required("Password is required"),
  });

  const handleSignIn = async (values, actions) => {
    try {
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
        values.userIdentifier
      );
      const payload = {
        password: values.password,
        remember: values.remember,
      };
      if (isEmail) {
        payload.email = values.userIdentifier;
      } else {
        payload.mobileNumber = values.userIdentifier;
      }

      const response = await axios.post(`${apiUrl}/auth/signin`, payload);
      const { token, user: userData } = response.data;

      signIn(token, userData);
      actions.setSubmitting(false);
    } catch (error) {
      console.error("Sign in error:", error);
      actions.setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSignIn}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label
                      htmlFor="userIdentifier"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email or Mobile Number
                    </label>
                    <Field
                      type="text"
                      name="userIdentifier"
                      id="userIdentifier"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com or 1234567890"
                    />
                    <ErrorMessage
                      name="userIdentifier"
                      component="div"
                      className="text-red-500 text-xs italic"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs italic"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Field
                          type="checkbox"
                          name="remember"
                          id="remember"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-300"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <Link
                      to="/reset-password"
                      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                </Form>
              )}
            </Formik>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
