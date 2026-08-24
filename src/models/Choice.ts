export interface Choice {
    id: number;
    question_id: number;
    label: string;
    is_correct: boolean;
    position: number;
}

// Représentation envoyée à l'étudiant : ne contient JAMAIS is_correct (RG-07)
export interface ChoicePublic {
    id: number;
    label: string;
    position: number;
}

export function toPublicChoice(c: Choice): ChoicePublic {
    return { id: c.id, label: c.label, position: c.position };
}
