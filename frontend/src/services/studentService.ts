import api from '../api/api';
import type { Student, StudentFormData, StudentStats } from '../types/types';

export const studentService = {
    getAllStudents: async () => {
        const response = await api.get<Student[]>('/students/');
        return response.data;
    },

    getStudentById: async (id: string) => {
        const response = await api.get<Student>(`/students/${id}`);
        return response.data;
    },

    getStudentStats: async (id: string) => {
        const response = await api.get<StudentStats>(`/students/${id}/media-voti`);
        return response.data;
    },

    createStudent: async (data: StudentFormData) => {
        const response = await api.post<Student>('/students/', data);
        return response.data;
    },

    updateStudent: async (id: string, data: Partial<StudentFormData>) => {
        const response = await api.put<Student>(`/students/${id}`, data);
        return response.data;
    },

    deleteStudent: async (id: string) => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },

    addModuleToStudent: async (studentId: string, moduleId: string) => {
        const response = await api.post(`/students/${studentId}/moduli`, { modulo_id: moduleId });
        return response.data;
    },

    removeModuleFromStudent: async (studentId: string, moduleId: string) => {
        const response = await api.delete(`/students/${studentId}/moduli/${moduleId}`);
        return response.data;
    },

    // Note: The backend route for adding exams is /exams/, not /students/:id/exams
    // But we might need a helper here if we want to keep it student-centric
};
