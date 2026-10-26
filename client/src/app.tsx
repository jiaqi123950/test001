import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import TasksPage from './pages/TasksPage/TasksPage';
import NotFound from './pages/NotFound/NotFound';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TasksPage />} />
        <Route path="tasks" element={<TasksPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
