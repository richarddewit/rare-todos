import { AxiosStatic } from "axios";
import dayjs from "dayjs";
import {
    FormEvent,
    MouseEvent,
    useRef,
    useState,
} from "react";

import * as Routes from "../utils/routes.js";

import Sort from "../enums/Sort";
import { ITodo } from "../interfaces/TodoInterfaces";

const mapTodos = (todos: any[]): ITodo[] => {
    return todos.map((todo) => ({
        ...todo,
        due_date: todo.due_date ? dayjs(new Date(todo.due_date).getTime()) : null,
    }));
};

const useTodoApi = (axios: AxiosStatic, initialTodos: ITodo[]) => {
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

    const onSetSort = (direction: Sort) => (event: MouseEvent) => {
        event.preventDefault();
        setSort(direction);
    };

    return {
        editing,
        formErrors,
        isLoading,
        sort,
        todos,

        todoBodyEl,
        todoDueDateEl,
        todoTitleEl,

        deleteTodo,
        editTodo,
        onSaveTodo,
        onSetSort,
        toggleDone,
    };
};

export default useTodoApi;
