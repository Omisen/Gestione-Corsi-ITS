export interface Module {
    _id: string;
    nome: string;
    codice: string;
    totale_ore: number;
    descrizione?: string;
}

export interface Exam {
    _id: string;
    studente: string | Student; // Can be ID or populated object
    modulo: string | Module;    // Can be ID or populated object
    data: string;
    voto: number;
    note?: string;
}

export interface Student {
    _id: string;
    nome: string;
    cognome: string;
    email: string;
    moduli: (string | Module)[];
    esami: (string | Exam)[];
}

export interface StudentStats {
    studente_id: string;
    nome: string;
    cognome: string;
    media: number;
    numero_esami: number;
    voto_minimo: number;
    voto_massimo: number;
}

// Form Types
export interface StudentFormData {
    nome: string;
    cognome: string;
    email: string;
}

export interface ExamFormData {
    studente_id: string;
    modulo_id: string;
    data: string;
    voto: number;
    note?: string;
}

export interface ModuleFormData {
    nome: string;
    codice: string;
    totale_ore: number;
    descrizione?: string;
}
