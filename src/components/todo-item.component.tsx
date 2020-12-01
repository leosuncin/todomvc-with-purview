import Purview, { ChangeEvent, KeyEvent } from 'purview';

import type { Todo } from '../entities/todo.entity';

export interface TodoItemProps {
  todo: Todo;
  onToggle(completed: boolean): Promise<void>;
  onDestroy(): Promise<void>;
  onEdit(title: string): Promise<void>;
}

interface TodoItemState {
  editText: string;
  editing: boolean;
}

class TodoItem extends Purview.Component<TodoItemProps, TodoItemState> {
  constructor(props: TodoItemProps) {
    super(props);
    this.setState({ editText: props.todo.title, editing: false });
  }

  private handleToggle(event: ChangeEvent<boolean>): Promise<void> {
    return this.props.onToggle(event.value);
  }

  private handleChange(event: ChangeEvent<string>): void {
    this.setState({
      editText: event.value,
    });
  }

  private async handleSubmit(): Promise<void> {
    const title = this.state.editText.trim();

    if (title && this.props.todo.title !== title) {
      await this.props.onEdit(title);
    }

    if (!title) {
      await this.props.onDestroy();
    }

    this.setState({ editing: false });
  }

  private async handleKeyDown(event: KeyEvent) {
    switch (event.key) {
      case 'Escape':
        this.setState({ editing: false, editText: this.props.todo.title });
        break;

      case 'Enter':
        await this.handleSubmit();
        break;
    }
  }

  render(): JSX.Element {
    const { todo } = this.props;
    const { editing, editText } = this.state;

    return (
      <li
        key={todo.id}
        class={editing ? 'editing' : todo.completed ? 'completed' : undefined}
      >
        <div class="view">
          <input
            name="completed"
            class="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleToggle.bind(this)}
          />
          <label onDblClick={() => this.setState({ editing: !editing })}>
            {todo.title}
          </label>
          <button
            class="destroy"
            aria-label="Remove one"
            onClick={this.props.onDestroy}
          />
        </div>
        <input
          name="title"
          class="edit"
          value={editText}
          onBlur={this.handleSubmit.bind(this)}
          onInput={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
        />
      </li>
    );
  }
}

export default TodoItem;
