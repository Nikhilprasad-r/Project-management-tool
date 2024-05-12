import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MdAddTask } from "react-icons/md";
import { FaCommentMedical } from "react-icons/fa6";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

const validationSchema = yup.object({
  taskName: yup.string().required("Task name is required"),
  description: yup.string().required("Description is required"),
  deadline: yup.date().required("Deadline is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Status is required"),
  cost: yup
    .number()
    .min(0, "Cost must be a positive number")
    .required("Cost is required"),
  comments: yup.array().of(
    yup.object({
      comment: yup.string().required("Comment is required"),
    })
  ),
});

const initialValues = {
  taskName: "",
  description: "",
  deadline: "",
  category: "",
  status: "pending",
  cost: 0,
  comments: [],
};

const TaskDetails = ({ task = initialValues }) => {
  const { user, apiUrl } = useApp();
  const [editable, setEditable] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (arrayHelpers) => {
    if (newComment) {
      arrayHelpers.push({
        comment: newComment,
        commentedBy: "currentUserId",
        commentedAt: new Date(),
      });
      setNewComment("");
    }
  };

  const deleteTask = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${apiUrl}/api/task/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          Swal.fire("Task deleted successfully!", "", "success");
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Failed to delete task", "", "error");
        }
      }
    });
  };

  const handleSubmit = async (values, actions) => {
    try {
      if (task._id) {
        const response = await axios.put(
          `${apiUrl}/api/task/${task._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        Swal.fire("Task updated successfully!", "", "success");
        actions.resetForm();
      } else {
        const response = await axios.post(`${apiUrl}/api/task`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        Swal.fire("Task created successfully!", "", "success");
        actions.resetForm();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Failed to update task", "", "error");
    }
  };

  if (user.role === "tl" || user.role === "admin") {
    setEditable(true);
  }

  return (
    <Formik
      initialValues={task || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleChange, setFieldValue, resetForm }) => (
        <Form className="space-y-4 max-w-[700px] mx-auto mt-12 rounded-2xl bg-slate-500 p-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Task Name
            </label>
            <Field
              name="taskName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Field
              name="description"
              as="textarea"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <Field
              type="date"
              name="deadline"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Field
              as="select"
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select a category</option>
              <option value="frontend">Front End</option>
              <option value="backend">Back End</option>
              <option value="devops">Devops</option>
            </Field>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Field
              as="select"
              name="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </Field>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost
            </label>
            <Field
              type="number"
              name="cost"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <FieldArray name="comments">
              {({ push, form }) => (
                <>
                  {form.values.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-100 rounded p-2 mb-2">
                      <p className="text-sm text-gray-800">{comment.comment}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(comment.commentedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    rows="2"
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => handleAddComment(push)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                  >
                    <FaCommentMedical />
                  </button>
                </>
              )}
            </FieldArray>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          >
            <MdAddTask />
          </button>
          {editable && (
            <button
              type="button"
              onClick={() => deleteTask(task._id)}
              className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default TaskDetails;
