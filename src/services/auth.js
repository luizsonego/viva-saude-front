export const TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN;
export const isAuthenticated = () => true;
// export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => true;

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.assign(`/login`);
};
