import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import TaskDetails from "./TaskDetails";
import { useApp } from "../context/AppContext";
import { IoClose } from "react-icons/io5";
import { FaDeleteLeft, FaCommentMedical } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

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
      comment: yup.string(),
    })
  ),
  teamLeader: yup.string().required("A team leader is required"),
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
  title: "",
  description: "",
  category: "",
  deadlines: "", // Default to empty string
  technologies: [],
  totalManDays: 0,
  deploymentUrl: "",
  codebaseUrl: "",
  totalMarks: 0,
  evaluation: "pending",
  status: "pending",
  cost: 0,
  comments: [],
  tasks: [],
  teamLeader: "",
};

const ProjectForm = ({
  project = initialValues,
  teamLeaders = [],
  users = [],
}) => {
  const [newComment, setNewComment] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [showTeamLeaderSelect, setShowTeamLeaderSelect] = useState(false);
  const [newTask, setNewTask] = useState(false);
  const { apiCall, formMode, setFormMode, user } = useApp();

  const fetchTasks = async () => {
    try {
      const result = await apiCall("get", `/api/tasks/project/${project._id}`);
      setTasks(result || []);
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
  }, [project]);

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
          await apiCall("delete", `/api/project/${id}`);
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
      if (project._id) {
        await apiCall("put", `/api/project/${project._id}`, values);
        Swal.fire("Project updated successfully!", "", "success");
      } else {
        await apiCall("post", `/api/project`, values);
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
        commentedBy: "currentUserId",
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

  const handleToggleTeamLeaderSelect = () => {
    setShowTeamLeaderSelect(!showTeamLeaderSelect);
  };

  const createTask = () => {
    setNewTask(true);
  };

  const isEditMode = Boolean(project._id);

  return (
    <>
      <div className="p-4 sm:ml-64 mt-10">
        <Formik
          initialValues={
            isEditMode
              ? {
                  ...initialValues,
                  ...project,
                  deadlines: formatDate(project.deadlines),
                  teamLeader: project.teamLeader,
                }
              : initialValues
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
                <Field name="title" className="input" placeholder="Title" />
                <Field
                  name="description"
                  as="textarea"
                  className="input"
                  placeholder="Description"
                />
                <Field name="category" as="select" className="input">
                  <option value="">Select a category</option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Research">Research</option>
                  <option value="Marketing Project">Marketing Project</option>
                </Field>
                <Field
                  name="deadlines"
                  type="date"
                  className="input"
                  placeholder="Deadline"
                />
                <FieldArray name="technologies">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.technologies.map((technology, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Field
                            name={`technologies.${index}`}
                            className="input"
                            placeholder="Technology"
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
                        Add Technology
                      </button>
                    </>
                  )}
                </FieldArray>
                <Field
                  name="totalManDays"
                  type="number"
                  className="input"
                  placeholder="Total Man Days"
                />
                <Field
                  name="deploymentUrl"
                  type="url"
                  className="input"
                  placeholder="Deployment URL"
                />
                {project._id ? (
                  <div className="input capitalize">
                    {users.find((user) => user._id === project.teamLeader).name}
                  </div>
                ) : (
                  <Field
                    name="teamLeader"
                    as="select"
                    className="input"
                    onChange={(e) => {
                      setFieldValue("teamLeader", e.target.value);
                      handleToggleTeamLeaderSelect();
                    }}
                  >
                    <option value="">Assign Team Leader</option>
                    {teamLeaders.map((leader) => (
                      <option key={leader._id} value={leader._id}>
                        {leader.name}
                      </option>
                    ))}
                  </Field>
                )}
                <Field
                  name="codebaseUrl"
                  type="url"
                  className="input"
                  placeholder="Codebase URL"
                />
                <Field
                  name="totalMarks"
                  type="number"
                  className="input"
                  placeholder="Total Marks"
                />
                <Field name="evaluation" as="select" className="input">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="excellent">Excellent</option>
                </Field>
                <Field name="status" as="select" className="input">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Field>
                <Field
                  name="cost"
                  type="number"
                  className="input"
                  placeholder="Cost"
                />
                {project._id && (
                  <button
                    type="button"
                    onClick={createTask}
                    className="btn-create-task"
                  >
                    Create Task
                  </button>
                )}
                <select
                  onChange={handleTaskSelect}
                  value={selectedTaskId}
                  className="input"
                >
                  <option value="">Select a task</option>
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.name}
                    </option>
                  ))}
                </select>
                {selectedTaskId && formMode === "task" && (
                  <TaskDetails
                    task={tasks.find((task) => task._id === selectedTaskId)}
                  />
                )}
                <FieldArray name="comments">
                  {({ push, form }) => (
                    <>
                      {form.values.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 rounded p-2 mb-2"
                        >
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
                        className="btn-add"
                      >
                        <FaCommentMedical />
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>
              <div className="grid lg:grid-cols-4 gap-4 p-4">
                <button type="submit" className="btn-submit col-span-1">
                  Save Changes
                </button>
                {project._id && (
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="btn-delete col-span-1"
                  >
                    <MdDeleteForever />
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {newTask && <TaskDetails projectId={project._id} />}
    </>
  );
};

export default ProjectForm;
