import api from '../api/api';
import type { Module, ModuleFormData } from '../types/types';

export const moduleService = {
    getAllModules: async () => {
        const response = await api.get<Module[]>('/modules/');
        return response.data;
    },

    getModuleById: async (id: string) => {
        const response = await api.get<Module>(`/modules/${id}`);
        return response.data;
    },

    createModule: async (data: ModuleFormData) => {
        const response = await api.post<Module>('/modules/', data);
        return response.data;
    },

    updateModule: async (id: string, data: Partial<ModuleFormData>) => {
        const response = await api.put<Module>(`/modules/${id}`, data);
        return response.data;
    },

    deleteModule: async (id: string) => {
        const response = await api.delete(`/modules/${id}`);
        return response.data;
    }
};
