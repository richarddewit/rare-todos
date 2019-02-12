import React, {
    FormEvent,
    FunctionComponent,
    useMemo,
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

    const createTodo = async (todo: ITodo) => {
        setIsLoading(true);

        await axios.post(Routes.todos_path(), todo);

        fetchTodos();
    };
    const onCreateTodo = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const todo: ITodo = {
            body: form.todoBody.value,
            completed_on: null,
            due_date: form.todoDueDate.value,
            id: null,
            title: form.todoTitle.value,
        };
        await createTodo(todo);
        form.reset();
    };

    const todoListItems = todos.map((todo: ITodo, index: number) => (
        <TodoListItem
            key={index}
            todo={todo}
            toggleDone={toggleDone}
        />
    ));

    return (
        <>
            <div className="panel panel-default">
                <div
                    className="panel-heading text-center"
                    dangerouslySetInnerHTML={{ __html: isLoading ? "Loading..." : "&nbsp;" }}
                />

                <div className="panel-body">
                    <form onSubmit={onCreateTodo}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" className="form-control" name="todoTitle" />
                        </div>
                        <div className="form-group">
                            <label>Body</label>
                            <textarea className="form-control" rows={3} name="todoBody" />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="text" className="form-control" name="todoDueDate" />
                        </div>
                        <button className="btn btn-primary" type="submit">Save</button>
                    </form>
                </div>

                <ul className="list-group">
                    {todoListItems}
                </ul>
            </div>
        </>
    );
};

export default TodoApp;
