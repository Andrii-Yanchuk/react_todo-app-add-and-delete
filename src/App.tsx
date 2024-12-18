/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Errors } from './types/ErrorType';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { getTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableToLoad));
  }, []);

  const filteredTodos = todos?.filter(todo => {
    switch (status) {
      case FilterType.Completed:
        return todo.completed;
      case FilterType.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const unCompletedTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList todos={filteredTodos} />
        {!!todos.length && (
          <TodoFooter
            status={status}
            setStatus={setStatus}
            unCompletedTodos={unCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
