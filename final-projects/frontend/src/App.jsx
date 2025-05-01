import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import UserRolesPage from './pages/UserRolesPage';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/roles" element={<RolesPage />} />
                        <Route path="/user-roles" element={<UserRolesPage />} />
                        <Route path="/" element={<DashboardPage />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
};

export default App; 