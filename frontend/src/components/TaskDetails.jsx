import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { MdAddTask } from "react-icons/md";
import { FaCommentMedical } from "react-icons/fa6";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

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
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialValues = {
  taskName: "",
  description: "",
  deadline: "",
  category: "",
  status: "pending",
  cost: 0,
  comments: [],
  assignedTo: "",
};

const TaskDetails = ({ task = initialValues, projectId }) => {
  const { user, apiCall, formMode, setFormMode } = useApp();
  const [users, setUsers] = useState([]);
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
  const fetchUsers = async () => {
    try {
      const response = await apiCall("get", "/api/team");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [task]);
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
          await apiCall("delete", `/api/task/${id}`);
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
      if (task._id) {
        await apiCall("put", `/api/task/${task._id}`, values);
        Swal.fire("Task updated successfully!", "", "success");
      } else {
        values.projectId = projectId;
        await apiCall("post", `/api/task`, values);
        Swal.fire("Task created successfully!", "", "success");
      }
      actions.resetForm();
      setFormMode("closed");
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Failed to update task", "", "error");
    } finally {
      actions.setSubmitting(false);
    }
  };

  const isEditMode = Boolean(task._id);

  const assignedUser =
    task.assignedTo && users.find((u) => u._id === task.assignedTo);

  return (
    <div className="p-4 sm:ml-64 mt-10">
      <Formik
        initialValues={
          isEditMode
            ? {
                ...task,
                deadline: formatDate(task.deadline),
                comments: task.comments || [],
              }
            : initialValues
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, setFieldValue, resetForm }) => (
          <Form className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className="flex justify-end py-3 text-red-600 text-2xl">
              <IoClose
                onClick={() => handleClose(resetForm)}
                className="cursor-pointer"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-4 mb-4">
              <Field
                name="taskName"
                className="input"
                placeholder="Task Name"
              />
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
              {assignedUser ? (
                <div className="input bg-gray-300 cursor-not-allowed">
                  Assigned to: {assignedUser.name}
                </div>
              ) : (
                <Field as="select" name="assignedTo" className="input">
                  <option value="">Assign to</option>
                  {users &&
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                </Field>
              )}

              <FieldArray name="comments">
                {({ push, form }) => (
                  <>
                    {form.values.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-100 rounded p-2 mb-2">
                        <p className="text-sm text-gray-800">
                          {comment.comment}
                        </p>
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
            </div>
            <div className="grid lg:grid-cols-4 gap-4 p-4">
              <button type="submit" className="btn-submit">
                <MdAddTask />
              </button>
              {editable && task._id && (
                <button
                  type="button"
                  onClick={() => deleteTask(task._id)}
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

export default TaskDetails;
