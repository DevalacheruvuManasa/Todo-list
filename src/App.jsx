import React, { useEffect, useState } from 'react';

const TODO_STORAGE_KEY = 'daylight-todos';
const AUTH_STORAGE_KEY = 'daylight-authenticated';
const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';

function getSavedTodos() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);
  return savedTodos ? JSON.parse(savedTodos) : [];
}

function getPageFromLocation() {
  return window.location.hash === '#/todos' &&
    sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    ? 'todos'
    : 'login';
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Enter your email and password to continue.');
    } else if (normalizedEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password do not match. Please try again.');
    } else {
      setError('');
      onLogin();
    }
  }

  return (
    <main className="login-layout">
      <section className="login-card" aria-labelledby="login-heading">
        <a className="brand" href="#/login" aria-label="Daylight home">
          <span className="brand-mark" aria-hidden="true">d</span>
          daylight
        </a>
        <p className="eyebrow">A LITTLE MORE FOCUS</p>
        <h1 id="login-heading">Make room for what matters.</h1>
        <p className="intro">Sign in to see your list and take the day one step at a time.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button login-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <p className="demo-hint">Demo login: <strong>student@example.com</strong><br />Password: <strong>password123</strong></p>
      </section>
      <aside className="login-art" aria-label="A calm start to your day">
        <div className="sun-orbit"><span className="sun" /><span className="orbit orbit-one" /><span className="orbit orbit-two" /></div>
        <div className="art-copy"><span>YOUR DAY, AT YOUR PACE</span><p>Small steps add up to a life you love.</p></div>
        <span className="sparkle sparkle-one" aria-hidden="true">✳</span>
        <span className="sparkle sparkle-two" aria-hidden="true">✳</span>
      </aside>
    </main>
  );
}

function TodoPage({ todos, onTodosChange, onLogout }) {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  function addTodo(event) {
    event.preventDefault();
    const title = newTodo.trim();
    if (!title) return;

    onTodosChange([{ id: crypto.randomUUID(), title, completed: false }, ...todos]);
    setNewTodo('');
  }

  function toggleTodo(todoId) {
    onTodosChange(todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    ));
  }

  function deleteTodo(todoId) {
    onTodosChange(todos.filter((todo) => todo.id !== todoId));
  }

  return (
    <main className="todo-layout">
      <header className="topbar">
        <a className="brand" href="#/todos" aria-label="Daylight home">
          <span className="brand-mark" aria-hidden="true">d</span>daylight
        </a>
        <button className="logout-button" onClick={onLogout} type="button">Log out <span aria-hidden="true">↗</span></button>
      </header>
      <section className="todo-content" aria-labelledby="todo-heading">
        <p className="eyebrow">YOUR PERSONAL SPACE</p>
        <h1 id="todo-heading">A fresh start, every day.</h1>
        <p className="intro">One thing at a time. You’ve got this.</p>
        <form className="add-form" onSubmit={addTodo}>
          <label className="visually-hidden" htmlFor="new-todo">Add a task</label>
          <input id="new-todo" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} placeholder="What would you like to get done?" />
          <button className="primary-button add-button" type="submit"><span aria-hidden="true">+</span> Add task</button>
        </form>
        <div className="list-toolbar">
          <p className="remaining-count"><strong>{remainingCount}</strong> {remainingCount === 1 ? 'task' : 'tasks'} left</p>
          <div className="filter-list" aria-label="Filter tasks">
            {['all', 'active', 'completed'].map((filterOption) => (
              <button key={filterOption} type="button" aria-pressed={filter === filterOption} className={`filter-button${filter === filterOption ? ' selected' : ''}`} onClick={() => setFilter(filterOption)}>
                {filterOption[0].toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li className="todo-item" key={todo.id}>
              <label className="todo-label">
                <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                <span className="custom-checkbox" aria-hidden="true">{todo.completed ? '✓' : ''}</span>
                <span className={todo.completed ? 'todo-title completed' : 'todo-title'}>{todo.title}</span>
              </label>
              <button className="delete-button" type="button" aria-label={`Delete ${todo.title}`} onClick={() => deleteTodo(todo.id)}>×</button>
            </li>
          ))}
          {visibleTodos.length === 0 && (
            <li className="empty-state">
              <span className="empty-icon" aria-hidden="true">✳</span>
              <p>{todos.length === 0 ? 'Your list is clear. Add a task to get started.' : `No ${filter} tasks right now.`}</p>
            </li>
          )}
        </ul>
        <p className="list-footnote">A little progress is still progress.</p>
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState(getPageFromLocation);
  const [todos, setTodos] = useState(getSavedTodos);

  useEffect(() => {
    function syncPage() {
      const nextPage = getPageFromLocation();
      setPage(nextPage);
      if (nextPage === 'login' && window.location.hash === '#/todos') {
        window.location.hash = '#/login';
      }
    }

    syncPage();
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function handleLogin() {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    window.location.hash = '#/todos';
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.hash = '#/login';
  }

  return page === 'todos'
    ? <TodoPage todos={todos} onTodosChange={setTodos} onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />;
}
