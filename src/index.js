import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Fragment>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Fragment>
);
