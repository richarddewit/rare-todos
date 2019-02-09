import React, { FunctionComponent } from "react";

interface ITodo {
  title: string;
  due_date: Date;

}

const TodoList: FunctionComponent<{ todos?: ITodo[] }> = ({ todos = [] }) => {
  return (
    <>
    <ul>
      {todos.map((todo: ITodo, index: number) => (<li key={index}>{todo.title}</li>))}
    </ul>
    </>
  );
};

export default TodoList;
