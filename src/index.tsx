import * as React from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./components/App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import "typeface-roboto";

declare const window: any;

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

ReactDOM.render(
  <>
    <CssBaseline />
    <App />
  </>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
