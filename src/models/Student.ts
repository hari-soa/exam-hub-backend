export interface Student {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    created_at: Date;
}

// Représentation sûre pour l'API (sans le hash du mot de passe)
export interface StudentPublic {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: Date;
}

export function toPublicStudent(s: Student): StudentPublic {
    return {
        id: s.id,
        name: s.name,
        email: s.email,
        is_active: s.is_active,
        created_at: s.created_at,
    };
}
