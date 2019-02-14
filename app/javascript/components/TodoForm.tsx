import React, {
    FunctionComponent,
    useContext,
} from "react";

import { TodoFormContext } from "../contexts/TodoContexts";

const TodoForm: FunctionComponent = () => {
    const {
        formErrors,
        onSaveTodo,
        todoTitleEl,
        todoBodyEl,
        todoDueDateEl,
    } = useContext(TodoFormContext);

    const formErrorHelp = (key: string) => {
        if (formErrors && (key in formErrors)) {
            return (
                <span className="help-block">
                    <ul>
                        {formErrors[key].map((error: string, index: number) => <li key={index}>{error}</li>)}
                    </ul>
                </span>
            );
        }
    };

    const formGroupClass = (key: string) => {
        const classNames = ["form-group"];
        if (formErrors && (key in formErrors)) {
            classNames.push("has-error");
        }
        return classNames.join(" ");
    };

    return (
        <form id="todo-form" onSubmit={onSaveTodo}>
            <div className={formGroupClass("title")}>
                <label htmlFor="todoTitle" className="control-label">Title</label>
                <input type="text" className="form-control" id="todoTitle" name="title" ref={todoTitleEl} />
                {formErrorHelp("title")}
            </div>
            <div className={formGroupClass("body")}>
                <label htmlFor="todoBody" className="control-label">Body</label>
                <textarea className="form-control" rows={3} id="todoBody" name="body" ref={todoBodyEl} />
                {formErrorHelp("body")}
            </div>
            <div className={formGroupClass("due_date")}>
                <label htmlFor="todoDueDate" className="control-label">Due Date</label>
                <input type="date" className="form-control" id="todoDueDate" name="dueDate" ref={todoDueDateEl} />
                {formErrorHelp("due_date")}
            </div>
            <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );
};

export default TodoForm;
