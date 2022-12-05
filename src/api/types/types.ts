export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export type FieldErrorType = { field: string; error: string };
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors?: Array<FieldErrorType>;
  data: D;
};

export enum TaskStatusesType {
  New = 0,
  InProgress = 1,
  // eslint-disable-next-line no-magic-numbers
  Completed = 2,
  // eslint-disable-next-line no-magic-numbers
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  // eslint-disable-next-line no-magic-numbers
  Hi = 2,
  // eslint-disable-next-line no-magic-numbers
  Later = 4,
}

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatusesType;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatusesType;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
export type GetTasksResponse = {
  error: Nullable<string>;
  totalCount: number;
  items: TaskType[];
};

export type Nullable<T> = null | T;
