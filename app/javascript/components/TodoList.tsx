import React, { FunctionComponent } from "react";

import ITodo from "../interfaces/Todo";
import TodoListItem from "./TodoListItem";

const TodoList: FunctionComponent<{ todos?: ITodo[] }> = ({ todos = [] }) => {
  const todoListItems = todos.map((todo: ITodo, index: number) => (
    <TodoListItem key={index} todo={todo} />
  ));

  return (
    <>
      <ul className="list-group">{todoListItems}</ul>
    </>
  );
};

export default TodoList;
