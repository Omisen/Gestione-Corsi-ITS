import api from '../api/api';
import type { Student, StudentFormData, StudentStats } from '../types/types';

export const studentService = {
    // GET 
    getAllStudents: async () => {
        const response = await api.get<Student[]>('/studenti/');
        return response.data;
    },

    getStudentById: async (id: string) => {
        const response = await api.get<Student>(`/studenti/${id}`);
        return response.data;
    },

    getStudentStats: async (id: string) => {
        const response = await api.get<StudentStats>(`/studenti/${id}/media-voti`);
        return response.data;
    },

    // POST
    createStudent: async (data: StudentFormData) => {
        const response = await api.post<Student>('/studenti/', data);
        return response.data;
    },

    // PUT
    updateStudent: async (id: string, data: Partial<StudentFormData>) => {
        const response = await api.put<Student>(`/studenti/${id}`, data);
        return response.data;
    },

    // DELETE
    deleteStudent: async (id: string) => {
        const response = await api.delete(`/studenti/${id}`);
        return response.data;
    },

    // POST per aggiungere i moduli dalla lista in Studente
    addModuleToStudent: async (studentId: string, moduleId: string) => {
        const response = await api.post(`/studenti/${studentId}/moduli`, { modulo_id: moduleId });
        return response.data;
    },

    // DELETE per aggiungere i moduli dalla lista in Studente
    removeModuleFromStudent: async (studentId: string, moduleId: string) => {
        const response = await api.delete(`/studenti/${studentId}/moduli/${moduleId}`);
        return response.data;
    },

    // Note: The backend route for adding exams is /esami/, not /studenti/:id/esami
    // But we might need a helper here if we want to keep it student-centric
};
