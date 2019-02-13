import dayjs from "dayjs";
import React, {
    FormEvent,
    FunctionComponent,
    MouseEvent,
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

enum Sort {
    Ascending = "asc",
    Descending = "desc",
}

const mapTodos = (todos: any[]): ITodo[] => {
    return todos.map((todo) => ({
        ...todo,
        due_date: todo.due_date ? dayjs(new Date(todo.due_date).getTime()) : null,
    }));
};

const sortTodos = (todos: ITodo[], direction: Sort): ITodo[] => {
    return todos.sort((a, b) => {
        const aDate = a.due_date || dayjs(0);
        const bDate = b.due_date || dayjs(0);
        if (aDate.isSame(bDate, "day")) {
            return 0;
        }
        if (direction === Sort.Ascending) {
            return aDate.isBefore(bDate, "day") ? -1 : 1;
        }
        return bDate.isBefore(aDate, "day") ? -1 : 1;
    });
};

const TodoApp: FunctionComponent<IProps> = ({ todos: initialTodos = [], csrfToken }) => {
    const axios = useMemo(() => initializeAxios(csrfToken), null);

    const [sort, setSort] = useState(Sort.Descending);
    const [todos, setTodos] = useState(mapTodos(initialTodos));
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
        setTodos(mapTodos(result.data));

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

            fetchTodos();
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            if (error.response && error.response.data) {
                setFormErrors(error.response.data);
            }
            setIsLoading(false);
        }
    };

    const editTodo = async (todo: ITodo) => {
        setEditing(todo);
        todoTitleEl.current.value = todo.title;
        todoBodyEl.current.value = todo.body;
        todoDueDateEl.current.value = todo.due_date ? todo.due_date.format("YYYY-MM-DD") : null;
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
        setFormErrors(null);

        const todo: ITodo = {
            body: todoBodyEl.current.value,
            completed_on: null,
            due_date: todoDueDateEl.current.value ? dayjs(new Date(todoDueDateEl.current.value).getTime()) : null,
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
                <input type="date" className="form-control" id="todoDueDate" name="dueDate" ref={todoDueDateEl} />
                {formErrorHelp("due_date")}
            </div>
            <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );

    const todoListItems = sortTodos(todos, sort).map((todo: ITodo, index: number) => (
        <TodoListItem
            key={index}
            todo={todo}
            toggleDone={toggleDone}
            editTodo={editTodo}
            deleteTodo={deleteTodo}
        />
    ));

    const onSetSort = (direction: Sort) => (event: MouseEvent) => {
        event.preventDefault();
        setSort(direction);
    };
    const sortToggle = (direction: Sort) => {
        const label = direction === Sort.Ascending ? "ascending" : "descending";

        if (sort === direction) {
            return <strong>{label}</strong>;
        }
        return <a href={"#" + label} onClick={onSetSort(direction)}>{label}</a>;
    };

    const appState = isLoading ? "Loading..." : "&nbsp;";
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
                    <li className="list-group-item list-group-item-primary text-center">
                        <span>Sort: Due Date</span>{" "}
                        {sortToggle(Sort.Ascending)}
                        {" / "}
                        {sortToggle(Sort.Descending)}
                    </li>
                    {todoListItems}
                </ul>
            </div>
        </>
    );
};

export default TodoApp;
