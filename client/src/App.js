import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sales from "./Sales";
import Customer from "./Customer";

export default function App() {
  const bodyElt = document.querySelector("body");
  bodyElt.style.backgroundColor = "#16161d";

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/sales">
            <Sales />
          </Route>
          <Route path="/customer">
            <Customer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
