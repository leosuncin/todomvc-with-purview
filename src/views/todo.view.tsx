import Purview from 'purview';

interface TodoState {}

class TodoMVC extends Purview.Component<{}, TodoState> {
  render(): JSX.Element<JSX.HTMLAttributes<HTMLElement>> {
    return <h1>Hello</h1>;
  }
}

export default TodoMVC;
