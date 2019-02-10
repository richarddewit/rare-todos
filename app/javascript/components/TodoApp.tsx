import React, { FunctionComponent } from "react";

import ITodo from "../interfaces/Todo";
import TodoList from "./TodoList";

const TodoApp: FunctionComponent<{ todos?: ITodo[] }> = ({ todos = [] }) => {

  return (
    <>
      <TodoList todos={todos} />
    </>
  );
};

export default TodoApp;
