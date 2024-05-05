import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useApp } from "../context/AppContext";
const projectSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  deadlines: Yup.date().required("Required"),
  deploymentUrl: Yup.string().url("Invalid URL").required("Required"),
  codebaseUrl: Yup.string().url("Invalid URL").required("Required"),
});

const CreateProject = () => {
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Create New Project</h2>
      <Formik
        initialValues={{
          title: "",
          description: "",
          category: "",
          deadlines: "",
          deploymentUrl: "",
          codebaseUrl: "",
        }}
        validationSchema={projectSchema}
        onSubmit={(values, actions) => {
          CreateProject(values);
          actions.setSubmitting(false);
          actions.resetForm();
        }}
      >
        {({ errors, touched }) => (
          <Form className="grid grid-cols-1 gap-6">
            <Field name="title" className="input" placeholder="Title" />
            {errors.title && touched.title ? <div>{errors.title}</div> : null}
            <Field
              name="description"
              className="input"
              placeholder="Description"
            />
            {errors.description && touched.description ? (
              <div>{errors.description}</div>
            ) : null}
            <Field name="category" className="input" placeholder="Category" />
            {errors.category && touched.category ? (
              <div>{errors.category}</div>
            ) : null}
            <Field
              name="deadlines"
              type="date"
              className="input"
              placeholder="Deadlines"
            />
            {errors.deadlines && touched.deadlines ? (
              <div>{errors.deadlines}</div>
            ) : null}
            <Field
              name="deploymentUrl"
              className="input"
              placeholder="Deployment URL"
            />
            {errors.deploymentUrl && touched.deploymentUrl ? (
              <div>{errors.deploymentUrl}</div>
            ) : null}
            <Field
              name="codebaseUrl"
              className="input"
              placeholder="Codebase URL"
            />
            {errors.codebaseUrl && touched.codebaseUrl ? (
              <div>{errors.codebaseUrl}</div>
            ) : null}
            <button type="submit" className="btn mt-4">
              Create Project
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateProject;
