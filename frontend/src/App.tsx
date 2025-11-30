import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Layout from './components/Layout/Layout';

// Pages
import StudentsList from './pages/Students/StudentsList';
import StudentForm from './pages/Students/StudentForm';
import StudentDetail from './pages/Students/StudentDetail';

import ModulesList from './pages/Modules/ModulesList';
import ModuleForm from './pages/Modules/ModuleForm';

// Placeholder components for now
const Dashboard = () => <div><h2>Dashboard</h2><p>Benvenuto nel gestionale ITS.</p></div>;
const Exams = () => <div><h2>Esami</h2><p>Funzionalità in arrivo.</p></div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />

            {/* Students Routes */}
            <Route path="students" element={<StudentsList />} />
            <Route path="students/new" element={<StudentForm />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="students/:id/edit" element={<StudentForm />} />

            {/* Modules Routes */}
            <Route path="modules" element={<ModulesList />} />
            <Route path="modules/new" element={<ModuleForm />} />
            <Route path="modules/:id/edit" element={<ModuleForm />} />

            {/* Other Routes */}
            <Route path="exams" element={<Exams />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
