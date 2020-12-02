import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";
import App from "./Form";
import Localforage from "./Localforage";

export const Routes = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/form" exact component={App} />
        <Route path="/forage" component={Localforage} />
      </Switch>
    </Router>
  );
};

export default Routes;
