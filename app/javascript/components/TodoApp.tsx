import React, {
    FormEvent,
    FunctionComponent,
    useMemo,
    useRef,
    useState,
} from "react";

import initializeAxios from "../utils/axios";
import * as Routes from "../utils/routes.js";

import ITodo from "../interfaces/Todo";

import TodoListItem from "./TodoListItem";

interface IProps {
    todos?: ITodo[];
    csrfToken: string;
}

const TodoApp: FunctionComponent<IProps> = ({ todos: initialTodos = [], csrfToken }) => {
    const axios = useMemo(() => initializeAxios(csrfToken), null);

    const [todos, setTodos] = useState(initialTodos);
    const [isLoading, setIsLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const todoTitleEl = useRef(null);
    const todoBodyEl = useRef(null);
    const todoDueDateEl = useRef(null);

    const resetForm = () => {
        todoTitleEl.current.value = "";
        todoBodyEl.current.value = "";
        todoDueDateEl.current.value = "";
    };

    const fetchTodos = async () => {
        setIsLoading(true);

        const result = await axios(Routes.todos_path());
        setTodos(result.data);

        setIsLoading(false);
    };

    const toggleDone = async (todo: ITodo) => {
        setIsLoading(true);

        todo.completed_on = todo.completed_on === null ? new Date() : null;
        await axios.put(Routes.todo_path(todo), todo);

        fetchTodos();
    };

    const saveTodo = async (todo: ITodo) => {
        setIsLoading(true);

        try {
            if (editing) {
                await axios.put(Routes.todo_path(todo), todo);
            } else {
                await axios.post(Routes.todos_path(), todo);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setFormErrors(error.response.data);
            }
        }

        fetchTodos();
    };

    const editTodo = async (todo: ITodo) => {
        setEditing(todo);
        todoTitleEl.current.value = todo.title;
        todoBodyEl.current.value = todo.body;
        todoDueDateEl.current.value = todo.due_date;
        todoTitleEl.current.focus();
    };

    const deleteTodo = async (todo: ITodo) => {
        if (confirm(`Do you want to delete todo "${todo.title}?"`)) {
            setIsLoading(true);

            await axios.delete(Routes.todo_path(todo));

            fetchTodos();
        }
    };

    const onSaveTodo = async (event: FormEvent) => {
        event.preventDefault();

        const todo: ITodo = {
            body: todoBodyEl.current.value,
            completed_on: null,
            due_date: todoDueDateEl.current.value,
            id: editing ? editing.id : null,
            title: todoTitleEl.current.value,
        };
        await saveTodo(todo);

        resetForm();
        setEditing(null);
    };

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

    const todoForm = (
        <form onSubmit={onSaveTodo}>
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
                <input type="text" className="form-control" id="todoDueDate" name="dueDate" ref={todoDueDateEl} />
                {formErrorHelp("due_date")}
            </div>
            <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );

    const todoListItems = todos.map((todo: ITodo, index: number) => (
        <TodoListItem
            key={index}
            todo={todo}
            toggleDone={toggleDone}
            editTodo={editTodo}
            deleteTodo={deleteTodo}
        />
    ));

    const appState = formErrors ? "Something went wrong" : (isLoading ? "Loading..." : "&nbsp;");
    return (
        <>
            <div className="panel panel-default">
                <div
                    className="panel-heading text-center"
                    dangerouslySetInnerHTML={{ __html: appState }}
                />

                <div className="panel-body">
                    {todoForm}
                </div>

                <ul className="list-group">
                    {todoListItems}
                </ul>
            </div>
        </>
    );
};

export default TodoApp;
