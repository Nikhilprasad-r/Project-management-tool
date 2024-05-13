import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useApp } from "../context/AppContext";
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  mobileNumber: yup.string().required("Mobile number is required"),
  dob: yup.date().required("Date of birth is required"),
  role: yup.string().required("Role is required"),
  profilePic: yup.string(),
  hourlyRate: yup
    .number()
    .required("Hourly rate is required")
    .min(0, "Hourly rate must be a positive number"),
  skills: yup.array().of(yup.string()),
});

const initialValues = {
  name: "",
  email: "",
  mobileNumber: "",
  dob: "",
  role: "",
  profilePic: "",
  hourlyRate: 0,
  skills: [],
};

const UserForm = ({ user = initialValues }) => {
  const { apiUrl } = useApp();
  const deleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${apiUrl}/api/users/${id}`);
          const data = await response.json();
          Swal.fire({
            icon: "success",
            title: "User deleted",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred. Please try again later",
          });
        }
      }
    });
  };

  const onSubmit = async (values) => {
    try {
      if (user) {
        const response = await axios.put(`${apiUrl}/api/users/${user._id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "User updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const response = await axios.post(`${apiUrl}/api/users`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "User created",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later",
      });
    }
  };

  return (
    <Formik
      initialValues={user || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className=" ml-[30%] space-y-4 flex flex-col max-w-[500px]">
          <Field name="name" className="input" placeholder="Name" />
          <Field
            name="email"
            type="email"
            className="input"
            placeholder="Email"
          />
          <Field
            name="mobileNumber"
            className="input"
            placeholder="Mobile Number"
          />
          <Field name="dob" type="date" className="input" />

          <Field name="role" as="select" className="select">
            <option value="fed">Front End Developer</option>
            <option value="bed">Back End Developer</option>
            <option value="ds">Devops</option>
            <option value="tl">Team Leader</option>
          </Field>
          <Field
            name="profilePic"
            type="url"
            className="input"
            placeholder="Profile Picture URL"
          />
          <Field
            name="hourlyRate"
            type="number"
            className="input"
            placeholder="Hourly Rate"
          />
          <FieldArray name="skills">
            {({ push, remove, form }) => (
              <>
                {form.values.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Field
                      name={`skills.${index}`}
                      className="input flex-1"
                      placeholder="Skill"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push("")}
                  className="btn-add"
                >
                  Add Skill
                </button>
              </>
            )}
          </FieldArray>
          <button type="submit" className="btn-submit">
            Save User
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
