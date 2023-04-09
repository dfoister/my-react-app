import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createHashRouter, RouterProvider} from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";
import Chess from "./Chess";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createHashRouter([
    {
        path: "/",
        element: <AnimatedBackground/>,
    },
    {
        path: "/chess",
        element: <Chess/>,
    },
]);

root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
