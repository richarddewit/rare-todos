import React, {
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

    const todoListItems = todos.map((todo: ITodo, index: number) => (
        <TodoListItem
            key={index}
            todo={todo}
            toggleDone={toggleDone}
        />
    ));

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: isLoading ? "Loading..." : "&nbsp;" }} />
            {todoListItems}
        </>
    );
};

export default TodoApp;
