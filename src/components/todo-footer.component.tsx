import Purview from 'purview';

export type FilterBy = 'all' | 'active' | 'completed';

export interface TodoFooterProps {
  completedCount: number;
  count: number;
  nowShowing: FilterBy;
  onClearCompleted(): Promise<void>;
  onSwitchFilter(filter: FilterBy): void;
}

class TodoFooter extends Purview.Component<TodoFooterProps, {}> {
  get activeTodoWord(): string {
    return this.props.count > 1 ? 'items' : 'item';
  }

  render(): JSX.Element {
    return (
      <footer class="footer">
        <span class="todo-count">
          <strong>{this.props.count}</strong> {this.activeTodoWord} left
        </span>
        <ul class="filters">
          <li>
            <a
              href="#/all"
              class={this.props.nowShowing === 'all' ? 'selected' : undefined}
              onClick={() =>
                this.props.nowShowing !== 'all' &&
                this.props.onSwitchFilter('all')
              }
            >
              All
            </a>
          </li>
          <li>
            <a
              href="#/active"
              class={
                this.props.nowShowing === 'active' ? 'selected' : undefined
              }
              onClick={() =>
                this.props.nowShowing !== 'active' &&
                this.props.onSwitchFilter('active')
              }
            >
              Active
            </a>
          </li>
          <li>
            <a
              href="#/completed"
              class={
                this.props.nowShowing === 'completed' ? 'selected' : undefined
              }
              onClick={() =>
                this.props.nowShowing !== 'completed' &&
                this.props.onSwitchFilter('completed')
              }
            >
              Completed
            </a>
          </li>
        </ul>
        {this.props.completedCount > 0 ? (
          <button class="clear-completed" onClick={this.props.onClearCompleted}>
            Clear completed
          </button>
        ) : null}
      </footer>
    );
  }
}

export default TodoFooter;
