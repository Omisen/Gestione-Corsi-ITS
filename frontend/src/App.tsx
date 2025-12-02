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
import ExamsList from './pages/Exams/ExamsList';
import ExamForm from './pages/Exams/ExamForm';
import Dashboard from './pages/Dashboard/Dashboard';
import Statistics from './pages/Statistics/Statistics';

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

            {/* Exams Routes */}
            <Route path="exams" element={<ExamsList />} />
            <Route path="exams/new" element={<ExamForm />} />
            <Route path="exams/:id/edit" element={<ExamForm />} />

            {/* Statistics Route */}
            <Route path="statistics" element={<Statistics />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
