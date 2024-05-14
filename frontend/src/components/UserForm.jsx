import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useApp } from "../context/AppContext";
import { IoClose } from "react-icons/io5";

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
  const { apiUrl, setFormMode, token } = useApp();

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
          await axios.delete(`${apiUrl}/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire({
            icon: "success",
            title: "User deleted",
            showConfirmButton: false,
            timer: 1500,
          });
          setFormMode("close");
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

  const handleClose = (resetForm) => {
    setFormMode("closed");
    resetForm();
  };

  const onSubmit = async (values) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (user._id) {
        await axios.put(`${apiUrl}/admin/user/${user._id}`, values, config);
        Swal.fire({
          icon: "success",
          title: "User updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.post(`${apiUrl}/admin/create-user`, values, config);
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
      {({ values, setFieldValue, resetForm }) => (
        <Form className="space-y-4 max-w-[700px] mx-auto mt-20 rounded-2xl bg-slate-500 p-8">
          <div className="flex justify-end">
            <IoClose
              onClick={() => handleClose(resetForm)}
              className="cursor-pointer"
            />
          </div>
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
          <div className="flex justify-between">
            <button type="submit" className="btn-submit">
              Save User
            </button>
            {user._id && (
              <button
                type="button"
                onClick={() => deleteUser(user._id)}
                className="btn-delete"
              >
                Delete
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
