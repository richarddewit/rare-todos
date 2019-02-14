import dayjs from "dayjs";
import React, { FormEvent, FunctionComponent } from "react";

import { ITodo } from "../interfaces/TodoInterfaces";

type TodoCallback = (todo: ITodo) => void;
type FormCallback = (event: FormEvent) => void;

interface IProps {
    todo: ITodo;
    toggleDone: TodoCallback;
    editTodo: TodoCallback;
    deleteTodo: TodoCallback;
}

const ToggleDoneForm: FunctionComponent<{ onToggleDone: FormCallback, isDone: boolean }> = ({ onToggleDone, isDone }) => (
    <form
        className="toggle-done-form"
        onSubmit={onToggleDone}
        style={{ display: "inline-block", marginRight: ".3em" }}
    >
        <button
            className={"btn btn-xs btn-" + (isDone ? "success" : "primary")}
            type="submit"
        >
            <i className={"glyphicon glyphicon-" + (isDone ? "check" : "unchecked")} />
        </button>
    </form>
);

const EditForm: FunctionComponent<{ onEditTodo: FormCallback }> = ({ onEditTodo }) => (
    <form className="edit-form" onSubmit={onEditTodo} style={{ display: "inline-block", marginRight: ".3em" }}>
        <button
            className="btn btn-xs btn-warning"
            type="submit"
        >
            <i className="glyphicon glyphicon-pencil" />
        </button>
    </form>
);

const DeleteForm: FunctionComponent<{ onDeleteTodo: FormCallback }> = ({ onDeleteTodo }) => (
    <form className="delete-form" onSubmit={onDeleteTodo} style={{ display: "inline-block" }}>
        <button
            className="btn btn-xs btn-danger"
            type="submit"
        >
            <i className="glyphicon glyphicon-trash" />
        </button>
    </form>
);

const TodoListItem: FunctionComponent<IProps> = ({ todo, toggleDone, editTodo, deleteTodo }) => {
    const isDone = todo.completed_on !== null;
    const classNames = [
        "todo-list-item",
        "list-group-item",
    ];
    if (isDone) {
        classNames.push("done");
        classNames.push("list-group-item-success");
    }
    const dueDate = todo.due_date ? dayjs(todo.due_date) : null;
    const overdue = dueDate && dueDate.isBefore(dayjs(), "day") && !isDone;
    const dateLabel = dueDate ? (
        <span
            className={"todo-due-date label label-" + (isDone ? "success" : (overdue ? "danger" : "default"))}
            title={overdue ? "Overdue" : ""}
        >
            {dueDate.format("DD-MM-YYYY")}
        </span>
    ) : null;

    const onFormSubmit = (callback: TodoCallback) => (event: FormEvent) => {
        event.preventDefault();
        callback(todo);
    };
    const onToggleDone = onFormSubmit(toggleDone);
    const onEditTodo = onFormSubmit(editTodo);
    const onDeleteTodo = onFormSubmit(deleteTodo);

    return (
        <li className={classNames.join(" ")}>
            <div className="row">
                <div className="col-xs-1">
                    <ToggleDoneForm onToggleDone={onToggleDone} isDone={isDone} />
                </div>

                <div className="col-xs-6">
                    <h4 className="todo-title list-group-item-heading">
                        {todo.title}
                    </h4>

                    {todo.body && <p className="todo-body list-group-item-text">{todo.body}</p>}
                </div>

                <div className="col-xs-3 text-right">
                    {dateLabel}
                </div>

                <div className="col-xs-2 text-right">
                    {isDone || <EditForm onEditTodo={onEditTodo} />}
                    <DeleteForm onDeleteTodo={onDeleteTodo} />
                </div>
            </div>
        </li>
    );
};

export default TodoListItem;
