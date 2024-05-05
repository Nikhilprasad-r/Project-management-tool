import React, { act } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useApp } from "../context/AppContext";
const taskSchema = Yup.object().shape({
  projectName: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  technologies: Yup.array().of(Yup.string()).required("Required"),
  deadline: Yup.date().required("Required"),
  fileAttachments: Yup.array().of(Yup.string()),
});

const CreateTask = () => {
  const { CreateTask } = useApp();
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Create New Task</h2>
      <Formik
        initialValues={{
          projectName: "",
          description: "",
          technologies: [],
          deadline: "",
          fileAttachments: [],
        }}
        validationSchema={taskSchema}
        onSubmit={(values, actions) => {
          CreateTask(values);
          actions.setSubmitting(false);
          actions.resetForm();
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="grid grid-cols-1 gap-6">
            <Field
              name="projectName"
              className="input"
              placeholder="Project Name"
            />
            {errors.projectName && touched.projectName ? (
              <div>{errors.projectName}</div>
            ) : null}
            <Field
              name="description"
              className="input"
              placeholder="Description"
            />
            {errors.description && touched.description ? (
              <div>{errors.description}</div>
            ) : null}
            <Field
              name="technologies"
              className="input"
              placeholder="Technologies"
              as="select"
              multiple
              onChange={(e) =>
                setFieldValue(
                  "technologies",
                  [].slice.call(e.target.selectedOptions).map((o) => o.value)
                )
              }
            >
              {/* Map your technologies options here */}
            </Field>
            {errors.technologies && touched.technologies ? (
              <div>{errors.technologies}</div>
            ) : null}
            <Field
              name="deadline"
              type="date"
              className="input"
              placeholder="Deadline"
            />
            {errors.deadline && touched.deadline ? (
              <div>{errors.deadline}</div>
            ) : null}
            {/* Handle file attachments input similarly if needed */}
            <button type="submit" className="btn mt-4">
              Create Task
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateTask;
