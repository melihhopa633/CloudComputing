import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import UserRolesPage from './pages/UserRolesPage';
import TasksPage from './pages/TasksPage';
import AllTasks from './pages/tasks/AllTasks';
import CreateTask from './pages/tasks/CreateTask';
import TaskStatus from './pages/tasks/TaskStatus';
import UserTasks from './pages/tasks/UserTasks';
import LogViewerPage from './pages/LogViewerPage';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="roles" element={<RolesPage />} />
                        <Route path="roles/user-roles" element={<UserRolesPage />} />
                        <Route path="tasks" element={<TasksPage />}>
                            <Route index element={<Navigate to="all" replace />} />
                            <Route path="all" element={<AllTasks />} />
                            <Route path="create" element={<CreateTask />} />
                            <Route path="status" element={<TaskStatus />} />
                            <Route path="user" element={<UserTasks />} />
                        </Route>
                        <Route path="log-viewer" element={<LogViewerPage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App; 