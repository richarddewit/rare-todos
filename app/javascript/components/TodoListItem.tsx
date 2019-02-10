import React, { FunctionComponent } from "react";

import ITodo from "../interfaces/Todo";

const TodoListItem: FunctionComponent<{ todo: ITodo }> = ({ todo }) => {
  const classNames = ["list-group-item"];
  if (todo.completed_on !== null) {
    classNames.push("list-group-item-success");
  }
  return <li className={classNames.join(" ")}>{todo.title}</li>;
};

export default TodoListItem;
