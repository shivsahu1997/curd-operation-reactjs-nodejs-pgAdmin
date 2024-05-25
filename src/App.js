import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ListStudents from "./Components/ListStudents";
import InputStudents from "./Components/InputStudents";
import UserSignin from "./Components/SignIn/UserSignin";
import TodoList from "./Components/TodoList";


const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <TodoList />
  // }
  // {
  //   path: "/",
  //   element: <UserSignin />
  // }
  {
    path: "/",
    element: <ListStudents />,
  },
  {
    path: "/inputStudentsList",
    element: <InputStudents />,
  },
]);


function App() {
  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
