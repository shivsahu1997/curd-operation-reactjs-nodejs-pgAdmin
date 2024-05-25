import React from "react";
import { useRecoilValue } from "recoil";

import TodoListFilters from "./TodoListFilters";
import TodoItem from "./TodoItem";
import { filteredTodoListState } from "../recoilState";
import TodoItemCreator from "./TodoItemCreater";
import TodoListStats from "./TodoListState";

const TodoList = () => {
  const todoList = useRecoilValue(filteredTodoListState);
  return (
    <>
      <TodoListStats />
      <div style={{ display: "flex", gap: "10px" }}>
        <TodoItemCreator />
        <TodoListFilters />
      </div>
      {todoList.map((todoItem) => (
        <TodoItem item={todoItem} key={todoItem.id} />
      ))}
    </>
  );
};

export default TodoList;
