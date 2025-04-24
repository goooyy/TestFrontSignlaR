import React, { useState } from "react";

export const LoginForm = ({ onLogin, error }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="login-form">
      <h2>Вход в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};