import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MdAddTask } from "react-icons/md";
import { FaCommentMedical } from "react-icons/fa6";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";

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
  const { user, apiUrl, formMode, setFormMode, token } = useApp();
  const [editable, setEditable] = useState(
    user.role === "tl" || user.role === "admin"
  );
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (arrayHelpers) => {
    if (newComment) {
      arrayHelpers.push({
        comment: newComment,
        commentedBy: user._id,
        commentedAt: new Date(),
      });
      setNewComment("");
    }
  };

  const handleClose = (resetForm) => {
    setFormMode("closed");
    resetForm();
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
          await axios.delete(`${apiUrl}/api/task/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFormMode("closed");
          Swal.fire("Task deleted successfully!", "", "success");
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Failed to delete task", "", "error");
        }
      }
    });
  };

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (task._id) {
        await axios.put(`${apiUrl}/api/task/${task._id}`, values, config);
        Swal.fire("Task updated successfully!", "", "success");
        actions.resetForm();
        setFormMode("closed");
      } else {
        await axios.post(`${apiUrl}/api/task`, values, config);
        Swal.fire("Task created successfully!", "", "success");
        actions.resetForm();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Failed to update task", "", "error");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/70`}
    >
      <Formik
        initialValues={task || initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, setFieldValue, resetForm }) => (
          <Form className="max-w-md mx-auto bg-gray-700 p-5 rounded-lg">
            <div className="flex justify-end py-3 text-red-600 text-2xl">
              <IoClose
                onClick={() => handleClose(resetForm)}
                className="cursor-pointer"
              />
            </div>
            <Field name="taskName" className="input" placeholder="Task Name" />
            <Field
              name="description"
              as="textarea"
              className="input"
              placeholder="Description"
              rows="4"
            />
            <Field
              name="deadline"
              type="date"
              className="input"
              placeholder="Deadline"
            />
            <Field name="category" as="select" className="input">
              <option value="">Select a category</option>
              <option value="frontend">Front End</option>
              <option value="backend">Back End</option>
              <option value="devops">Devops</option>
            </Field>
            <Field name="status" as="select" className="input">
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </Field>
            <Field
              name="cost"
              type="number"
              className="input"
              placeholder="Cost"
            />
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
                    className="input"
                    placeholder="Add Comment"
                    rows="2"
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => handleAddComment(push)}
                    className="btn-add my-3"
                  >
                    <FaCommentMedical />
                  </button>
                </>
              )}
            </FieldArray>
            <button type="submit" className="btn-submit">
              <MdAddTask />
            </button>
            {editable && task._id && (
              <button
                type="button"
                onClick={() => deleteTask(task._id)}
                className="btn-delete"
              >
                Delete
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskDetails;
