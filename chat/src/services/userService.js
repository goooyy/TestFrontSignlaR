// src/services/userService.js
import apiClient from './apiClient';

const userService = {
  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise<Object>} - Ответ сервера
   */
  register: async (userData) => {
    return apiClient.post('/auth/unregistered-users', userData);
  },

  /**
   * Авторизация пользователя
   * @param {Object} credentials - email и пароль
   * @returns {Promise<Object>} - Ответ с токеном
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      console.log("userService");
      console.log(response.accessToken);
      localStorage.setItem('authToken', response.accessToken);
      return { token: response.accessToken };
    }
    catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
};

export default userService;