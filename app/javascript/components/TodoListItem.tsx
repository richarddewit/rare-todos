import dayjs from "dayjs";
import React, { FormEvent, FunctionComponent } from "react";

import ITodo from "../interfaces/Todo";

type TodoCallback = (todo: ITodo) => void;
interface IProps {
    todo: ITodo;
    toggleDone: TodoCallback;
    editTodo: TodoCallback;
    deleteTodo: TodoCallback;
}

const TodoListItem: FunctionComponent<IProps> = ({ todo, toggleDone, editTodo, deleteTodo }) => {
    const isDone = todo.completed_on !== null;
    const classNames = ["list-group-item"];
    if (isDone) {
        classNames.push("list-group-item-success");
    }
    const dueDate = todo.due_date ? dayjs(todo.due_date) : null;
    const overdue = dueDate && dueDate.isBefore(dayjs(), "day") && !isDone;
    const dateLabel = dueDate ? (
        <span
            className={"label label-" + (isDone ? "success" : (overdue ? "danger" : "default"))}
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

    const toggleDoneForm = (
        <form onSubmit={onToggleDone} style={{ display: "inline-block", marginRight: ".3em" }}>
            <button
                className={"btn btn-xs btn-" + (isDone ? "success" : "primary")}
                type="submit"
            >
                <i className={"glyphicon glyphicon-" + (isDone ? "check" : "unchecked")} />
            </button>
        </form>
    );
    const editForm = isDone ? null : (
        <form onSubmit={onEditTodo} style={{ display: "inline-block", marginRight: ".3em" }}>
            <button
                className="btn btn-xs btn-warning"
                type="submit"
            >
                <i className="glyphicon glyphicon-pencil" />
            </button>
        </form>
    );
    const deleteForm = (
        <form onSubmit={onDeleteTodo} style={{ display: "inline-block" }}>
            <button
                className="btn btn-xs btn-danger"
                type="submit"
            >
                <i className="glyphicon glyphicon-trash" />
            </button>
        </form>
    );

    return (
        <li className={classNames.join(" ")}>
            <div className="row">
                <div className="col-xs-1">
                    {toggleDoneForm}
                </div>

                <div className="col-xs-6">
                    <h4 className="list-group-item-heading">
                        {todo.title}
                    </h4>

                    {todo.body && <p className="list-group-item-text">{todo.body}</p>}
                </div>

                <div className="col-xs-3 text-right">
                    {dateLabel}
                </div>

                <div className="col-xs-2 text-right">
                    {editForm}
                    {deleteForm}
                </div>
            </div>
        </li>
    );
};

export default TodoListItem;
