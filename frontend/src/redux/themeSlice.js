import { createSlice } from '@reduxjs/toolkit';

const getInitial = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('uzrent-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

const initialState = { mode: getInitial() };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('uzrent-theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('uzrent-theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    initTheme: (state) => {
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
  },
});

export const { toggleTheme, setTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
