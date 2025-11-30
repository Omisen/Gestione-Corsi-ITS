import api from '../api/api';
import type { Exam, ExamFormData } from '../types/types';

export const examService = {
    getAllExams: async () => {
        const response = await api.get<Exam[]>('/esami/');
        return response.data;
    },

    getExamById: async (id: string) => {
        const response = await api.get<Exam>(`/esami/${id}`);
        return response.data;
    },

    createExam: async (data: ExamFormData) => {
        const response = await api.post<Exam>('/esami/', data);
        return response.data;
    },

    updateExam: async (id: string, data: Partial<ExamFormData>) => {
        const response = await api.put<Exam>(`/esami/${id}`, data);
        return response.data;
    },

    deleteExam: async (id: string) => {
        const response = await api.delete(`/esami/${id}`);
        return response.data;
    }
};
