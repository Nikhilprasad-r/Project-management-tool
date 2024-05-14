import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import TaskDetails from "./TaskDetails";
import axios from "axios";
import { useApp } from "../context/AppContext";
import { IoClose } from "react-icons/io5";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  deadlines: yup.date().required("Deadline is required"),
  technologies: yup
    .array()
    .of(yup.string())
    .required("At least one technology is required"),
  totalManDays: yup
    .number()
    .min(0, "Total man days must be a positive number")
    .required("Total man days is required"),
  deploymentUrl: yup.string().url("Enter a valid URL"),
  codebaseUrl: yup.string().url("Enter a valid URL"),
  totalMarks: yup.number().min(0, "Total marks must be a positive number"),
  evaluation: yup.string().required("Evaluation is required"),
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
  title: "",
  description: "",
  category: "",
  deadlines: "",
  technologies: [],
  totalManDays: 0,
  deploymentUrl: "",
  codebaseUrl: "",
  totalMarks: 0,
  evaluation: "pending",
  status: "pending",
  cost: 0,
  comments: [],
};

const ProjectForm = ({ project = initialValues }) => {
  const [newComment, setNewComment] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const { apiUrl, formMode, setFormMode, token } = useApp();

  const fetchTasks = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/api/tasks/project/${project._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTaskSelect = (e) => {
    setSelectedTaskId(e.target.value);
    setFormMode("task");
  };

  useEffect(() => {
    if (project._id) {
      fetchTasks();
    }
  }, [project._id]);

  const deleteProject = async (id) => {
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
          await axios.delete(`${apiUrl}/api/project/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Project deleted successfully!", "", "success");
        } catch (error) {
          console.error("Error deleting project:", error);
          Swal.fire("Failed to delete project.", "", "error");
        }
      }
    });
  };

  const onSubmit = async (values) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (project._id) {
        await axios.put(`${apiUrl}/api/project/${project._id}`, values, config);
        Swal.fire("Project updated successfully!", "", "success");
      } else {
        await axios.post(`${apiUrl}/api/project`, values, config);
        Swal.fire("Project created successfully!", "", "success");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      Swal.fire("Failed to update project.", "", "error");
    }
  };

  const handleAddComment = (arrayHelpers) => {
    if (newComment) {
      arrayHelpers.push({
        comment: newComment,
        commentedBy: "currentUserId", // Replace with actual user ID
        commentedAt: new Date(),
      });
      setNewComment("");
    }
  };

  const handleClose = (resetForm) => {
    setFormMode("closed");
    setSelectedTaskId("");
    resetForm();
  };

  return (
    <div className="space-y-4 max-w-[700px] mx-auto mt-20 rounded-2xl bg-slate-500 p-8">
      <div className="flex justify-end">
        <IoClose
          onClick={() => handleClose(resetForm)}
          className="cursor-pointer"
        />
      </div>
      <Formik
        initialValues={project || initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, handleChange, setFieldValue, resetForm }) => (
          <Form>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Field
                name="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
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
                <option value="Software Development">
                  Software Development
                </option>
                <option value="Research">Research</option>
                <option value="Marketing Project">Marketing Project</option>
              </Field>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <Field
                type="date"
                name="deadlines"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Technologies
              </label>
              <FieldArray name="technologies">
                {({ push, remove, form }) => (
                  <>
                    {form.values.technologies.map((technology, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Field
                          name={`technologies.${index}`}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-1 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                    >
                      Add Technology
                    </button>
                  </>
                )}
              </FieldArray>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Man Days
              </label>
              <Field
                type="number"
                name="totalManDays"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deployment URL
              </label>
              <Field
                type="url"
                name="deploymentUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Codebase URL
              </label>
              <Field
                type="url"
                name="codebaseUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <Field
                type="number"
                name="totalMarks"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Evaluation
              </label>
              <Field
                as="select"
                name="evaluation"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="excellent">Excellent</option>
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
                <option value="active">Active</option>
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      rows="2"
                    ></textarea>
                    <button
                      type="button"
                      onClick={() => handleAddComment(push)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                    >
                      Add Comment
                    </button>
                  </>
                )}
              </FieldArray>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            >
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
      <h2>Select a Task</h2>
      <select onChange={handleTaskSelect} value={selectedTaskId}>
        <option value="">Select a task</option>
        {tasks.map((task) => (
          <option key={task._id} value={task._id}>
            {task.taskName}
          </option>
        ))}
      </select>
      {selectedTaskId && formMode === "task" && (
        <TaskDetails task={tasks.find((task) => task._id === selectedTaskId)} />
      )}
    </div>
  );
};

export default ProjectForm;
