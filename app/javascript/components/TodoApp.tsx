import dayjs from "dayjs";
import React, {
    FunctionComponent,
    useContext,
    useMemo,
} from "react";

import initializeAxios from "../utils/axios";

import { TodoFormContext, TodoSortContext } from "../contexts/TodoContexts";
import Sort from "../enums/Sort";
import useTodoApi from "../hooks/useTodoApi";
import { ITodo } from "../interfaces/TodoInterfaces";

import TodoForm from "./TodoForm";
import TodoListItem from "./TodoListItem";

interface IProps {
    todos?: ITodo[];
    csrfToken: string;
}

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
const SortToggle: FunctionComponent<{ direction: Sort }> = ({ direction }) => {
    const { sort, onSetSort } = useContext(TodoSortContext);
    const label = direction === Sort.Ascending ? "ascending" : "descending";

    if (sort === direction) {
        return <strong>{label}</strong>;
    }
    return <a href={"#" + label} onClick={onSetSort(direction)}>{label}</a>;
};

const TodoApp: FunctionComponent<IProps> = ({ todos: initialTodos = [], csrfToken }) => {
    const axios = useMemo(() => initializeAxios(csrfToken), null);

    const {
        sort,
        todos,
        isLoading,
        /* editing, */
        formErrors,

        todoTitleEl,
        todoBodyEl,
        todoDueDateEl,

        toggleDone,
        editTodo,
        deleteTodo,
        onSaveTodo,
        onSetSort,
    } = useTodoApi(axios, initialTodos);

    const formContext = {
        formErrors,
        onSaveTodo,
        todoBodyEl,
        todoDueDateEl,
        todoTitleEl,
    };
    const sortContext = {
        onSetSort,
        sort,
    };

    const todoListItems = sortTodos(todos, sort).map((todo: ITodo, index: number) => (
        <TodoListItem
            key={index}
            todo={todo}
            toggleDone={toggleDone}
            editTodo={editTodo}
            deleteTodo={deleteTodo}
        />
    ));

    const todoForm = (
        <TodoFormContext.Provider value={formContext}>
            <TodoForm />
        </TodoFormContext.Provider>
    );

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

                <ul className="list-group" id="todo-list">
                    <li className="list-group-item list-group-item-primary text-center">
                        <span>Sort: Due Date</span>{" "}
                        <TodoSortContext.Provider value={sortContext}>
                            <SortToggle direction={Sort.Ascending} />
                            {" / "}
                            <SortToggle direction={Sort.Descending} />
                        </TodoSortContext.Provider>
                    </li>
                    {todoListItems}
                </ul>
            </div>
        </>
    );
};

export default TodoApp;
