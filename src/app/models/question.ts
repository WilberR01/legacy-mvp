export interface Alternative {
    text: string;
}

export interface Question {
    shortDescription: string;
    fullStatement: string;
    type: number;
    difficulty: number;
    expectedAnswer?: string;
    alternatives?: Alternative[];
    correctAlternativeIndex?: number | null;
    authorId?: number;      // Futuramente, virá do token do usuário
    categoryId?: number;    // Futuramente, virá de um seletor de categoria
}

export interface Category {
    id: number;
    name: string;
    description: string;
}