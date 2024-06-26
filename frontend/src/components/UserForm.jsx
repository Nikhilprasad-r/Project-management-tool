import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useApp } from "../context/AppContext";
import { IoClose } from "react-icons/io5";
import { FaDeleteLeft, FaCommentMedical } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

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
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
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
  const { apiCall, setFormMode } = useApp();

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
          await apiCall("delete", `/admin/user/${id}`);
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
      if (user._id) {
        await apiCall("put", `/admin/user/${user._id}`, values);
        Swal.fire({
          icon: "success",
          title: "User updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await apiCall("post", `/admin/create-user`, values);
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
  const isEditMode = Boolean(user._id);

  return (
    <div className="p-4 sm:ml-64 mt-10">
      <Formik
        initialValues={
          isEditMode
            ? { ...user, dob: formatDate(user.dob) }
            : { ...initialValues }
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className="flex justify-end py-3 text-red-600 text-2xl">
              <IoClose
                onClick={() => handleClose(resetForm)}
                className="cursor-pointer"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-4 mb-4">
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
              <Field name="role" as="select" className="input">
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
                          <FaDeleteLeft />
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
            </div>
            <div className="grid lg:grid-cols-4 gap-4 p-4">
              <button type="submit" className="btn-submit">
                Save User
              </button>
              {user._id && (
                <button
                  type="button"
                  onClick={() => deleteUser(user._id)}
                  className="btn-delete"
                >
                  <MdDeleteForever />
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
