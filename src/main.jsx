import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/Home/Home.jsx';
import App from './App.jsx';
import CountryDetails from './components/CountryDetails/CountryDetails.jsx';
import Compare from './components/Compare/Compare.jsx';
import Quiz from './components/Quiz/Quiz.jsx';
import ErrorPage from './components/ErrorPage/ErrorPage.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes cache
      gcTime: 1000 * 60 * 60, // 1 hour memory persistence
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/country/:countryName',
        element: <CountryDetails />,
      },
      {
        path: '/compare',
        element: <Compare />,
      },
      {
        path: '/quiz',
        element: <Quiz />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
