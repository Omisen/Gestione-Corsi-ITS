import api from '../api/api';

export interface OverviewStats {
    totale_studenti: number;
    totale_moduli: number;
    totale_esami: number;
    media_voti_generale: number;
    voto_minimo: number;
    voto_massimo: number;
    tasso_successo_percentuale: number;
    esami_promossi: number;
    esami_bocciati: number;
}

export interface MediaVotiModulo {
    _id: string;
    nome_modulo: string;
    codice_modulo: string;
    media_voto: number;
    numero_esami: number;
    voto_minimo: number;
    voto_massimo: number;
}

export interface StudentiPerModulo {
    _id: string;
    nome_modulo: string;
    codice_modulo: string;
    numero_studenti: number;
}

export interface DistribuzioneVoti {
    _id: number | string;
    range: string;
    count: number;
}

export interface TassoSuccesso {
    _id: string;
    nome_modulo: string;
    codice_modulo: string;
    totale_esami: number;
    promossi: number;
    bocciati: number;
    percentuale_successo: number;
}

export interface EsamiPerPeriodo {
    periodo: string;
    anno: number;
    mese: number;
    numero_esami: number;
    media_voto: number;
}

export const statsService = {
    getOverview: async (): Promise<OverviewStats> => {
        const response = await api.get<OverviewStats>('/stats/overview');
        return response.data;
    },

    getMediaVotiModuli: async (): Promise<MediaVotiModulo[]> => {
        const response = await api.get<MediaVotiModulo[]>('/stats/media-voti-moduli');
        return response.data;
    },

    getStudentiPerModulo: async (): Promise<StudentiPerModulo[]> => {
        const response = await api.get<StudentiPerModulo[]>('/stats/studenti-per-modulo');
        return response.data;
    },

    getDistribuzioneVoti: async (moduloId?: string): Promise<DistribuzioneVoti[]> => {
        const params = moduloId ? { modulo_id: moduloId } : {};
        const response = await api.get<DistribuzioneVoti[]>('/stats/distribuzione-voti', { params });
        return response.data;
    },

    getTassoSuccesso: async (): Promise<TassoSuccesso[]> => {
        const response = await api.get<TassoSuccesso[]>('/stats/tasso-successo');
        return response.data;
    },

    getEsamiTemporale: async (dataInizio?: string, dataFine?: string): Promise<EsamiPerPeriodo[]> => {
        const params: Record<string, string> = {};
        if (dataInizio) params.data_inizio = dataInizio;
        if (dataFine) params.data_fine = dataFine;
        const response = await api.get<EsamiPerPeriodo[]>('/stats/esami-temporale', { params });
        return response.data;
    },
};

export default statsService;
