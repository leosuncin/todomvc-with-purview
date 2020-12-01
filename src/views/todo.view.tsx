import Purview, { SubmitEvent } from 'purview';

import TodoFooter, { FilterBy } from '../components/todo-footer.component';
import TodoItem from '../components/todo-item.component';
import type { Todo } from '../entities/todo.entity';
import { TodoService } from '../services/todo.service';

interface TodoMVCProps {}
interface TodoState {
  todos: Todo[];
  filter: FilterBy;
}

class TodoMVC extends Purview.Component<TodoMVCProps, TodoState> {
  private service: Readonly<TodoService>;

  constructor(props: TodoMVCProps) {
    super(props);
    this.service = TodoService.getInstance();
  }

  async getInitialState(): Promise<TodoState> {
    try {
      const todos = await this.service.listTodos();

      return { todos, filter: 'all' };
    } catch (error) {
      console.error(error);
      return { todos: [], filter: 'all' };
    }
  }

  private async addTodoHandler(event: SubmitEvent): Promise<void> {
    try {
      const todo = await this.service.addTodo(
        event.fields as Pick<Todo, 'title'>,
      );
      this.setState({
        todos: [todo, ...this.state.todos],
      });
    } catch (error) {
      console.error('addTodoHandler', error);
    }
  }

  private async updateTodoHandler(
    todo: Todo,
    updates: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<void> {
    try {
      const _todo = await this.service.updateTodo(todo, updates);
      this.setState({
        todos: this.state.todos.map((todo) =>
          todo.id === _todo.id ? _todo : todo,
        ),
      });
    } catch (error) {
      console.error('updateTodoHandler', error);
    }
  }

  private async removeTodoHandler(todo: Todo): Promise<void> {
    try {
      const _todo = await this.service.removeTodo(todo);
      this.setState({
        todos: this.state.todos.filter((todo) => todo.id !== _todo.id),
      });
    } catch (error) {
      console.error('removeTodoHandler', error);
    }
  }

  private async clearCompletedTodosHandler(): Promise<void> {
    try {
      await this.service.clearCompletedTodo();
      this.setState({
        todos: this.state.todos.filter((todo) => !todo.completed),
      });
    } catch (error) {
      console.error('clearCompletedTodosHandler', error);
    }
  }

  get todos(): Todo[] {
    switch (this.state.filter) {
      case 'active':
        return this.state.todos.filter((todo) => !todo.completed);

      case 'completed':
        return this.state.todos.filter((todo) => todo.completed);

      default:
        return this.state.todos;
    }
  }

  render(): JSX.Element {
    const { todos, filter } = this.state;
    const completedCount = todos.reduce(
      (count, todo) => count + Number(todo.completed),
      0,
    );
    const pendingCount = todos.length - completedCount;

    return (
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <form onSubmit={this.addTodoHandler.bind(this)}>
            <input
              class="new-todo"
              name="title"
              placeholder="What needs to be done?"
              autofocus
            />
          </form>
        </header>
        <section
          class="main"
          style={`display: ${todos.length == 0 ? 'hidden' : 'block'}`}
        >
          <input id="toggle-all" class="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            {this.todos.map((todo) => (
              <TodoItem
                todo={todo}
                onToggle={(completed) =>
                  this.updateTodoHandler(todo, { completed })
                }
                onDestroy={this.removeTodoHandler.bind(this, todo)}
                onEdit={(title) => this.updateTodoHandler(todo, { title })}
              />
            ))}
          </ul>
        </section>
        <TodoFooter
          nowShowing={filter}
          completedCount={completedCount}
          count={pendingCount}
          onClearCompleted={this.clearCompletedTodosHandler.bind(this)}
          onSwitchFilter={(filter) => this.setState({ filter })}
        />
      </section>
    );
  }
}

export default TodoMVC;
