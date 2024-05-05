import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <Router>
      <AppProvider>
        {/* <Navigation />
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/activate/:token" exact component={Activate} />
          <Route path="/resetpassword" exact component={ResetPassword} />
          <Route
            path="/resetpassword/:token"
            exact
            component={SubmitNewPassword}
          />
          <Route path="/projects" exact component={ProjectList} />
          <Route path="/projects/create" exact component={ProjectForm} />
          <Route path="/projects/edit/:id" exact component={ProjectForm} />
          <Route path="/tasks" exact component={TaskList} />
          <Route path="/tasks/edit/:id" exact component={TaskForm} />
          <Route path="/tasks/create" exact component={TaskForm} />
        </Switch> */}
      </AppProvider>
    </Router>
  );
}

export default App;
