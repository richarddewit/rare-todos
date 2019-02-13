import dayjs from "dayjs";

export default interface ITodo {
    id: number;
    title: string;
    due_date: dayjs.Dayjs;
    body: string;
    completed_on: Date;
}
