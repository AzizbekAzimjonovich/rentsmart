import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import { initTheme } from "./redux/themeSlice";
import App from "./App";
import "./index.css";

store.dispatch(initTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "dark:bg-slate-800 dark:text-white",
            duration: 4000,
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
