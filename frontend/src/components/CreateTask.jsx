import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useApp } from "../context/AppContext";

const taskSchema = Yup.object().shape({
  projectId: Yup.string().required("Project is required"),
  description: Yup.string().required("Description is required"),
  technologies: Yup.array()
    .of(Yup.string())
    .required("At least one technology is required"),
  deadline: Yup.date().required("Deadline is required"),
  fileAttachments: Yup.array().of(Yup.string()),
});

const CreateTask = () => {
  const { createTask, projects } = useApp();
  const [projectOptions, setProjectOptions] = useState([]);

  useEffect(() => {
    if (projects.length > 0) {
      const options = projects.map((project) => ({
        value: project._id,
        label: project.title,
      }));
      setProjectOptions(options);
    }
  }, [projects]);

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Create New Task</h2>
      <Formik
        initialValues={{
          projectId: "",
          description: "",
          technologies: [],
          deadline: "",
          fileAttachments: [],
        }}
        validationSchema={taskSchema}
        onSubmit={(values, actions) => {
          createTask(values);
          actions.setSubmitting(false);
          actions.resetForm();
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700"
              >
                Project
              </label>
              <Field
                as="select"
                name="projectId"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a Project</option>
                {projectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              {errors.projectId && touched.projectId && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.projectId}
                </div>
              )}
            </div>
            <Field
              name="description"
              as="textarea"
              className="input"
              placeholder="Description"
            />
            {errors.description && touched.description && (
              <div className="text-red-500 text-xs">{errors.description}</div>
            )}
            <Field
              as="select"
              name="technologies"
              multiple
              className="input"
              onChange={(e) =>
                setFieldValue(
                  "technologies",
                  [].slice.call(e.target.selectedOptions).map((o) => o.value)
                )
              }
            >
              {/* Map your technologies options here */}
            </Field>
            {errors.technologies && touched.technologies && (
              <div className="text-red-500 text-xs">{errors.technologies}</div>
            )}
            <Field name="deadline" type="date" className="input" />
            {errors.deadline && touched.deadline && (
              <div className="text-red-500 text-xs">{errors.deadline}</div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Task
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateTask;
