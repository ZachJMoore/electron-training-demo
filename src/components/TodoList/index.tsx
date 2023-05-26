import { observer } from "mobx-react-lite";
import store from "../../store";
import TodoItem, { NewTodoItem } from "../TodoItem";
import styles from "./index.module.scss";

const TodoList = () => {
  return (
    <div className={styles.root}>
      <div className={styles.listContainer}>
        {!store.todos.length ? (
          <div className={styles.noTodos}>All caught up</div>
        ) : (
          store.todos
            .slice()
            .reverse()
            .map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
      <NewTodoItem store={store} />
    </div>
  );
};

export default observer(TodoList);
