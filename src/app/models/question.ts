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
    authorId?: number;
    categoryId?: number;

    id?: number;
    reputation?: number;
    categoryName?: string;
    authorName?: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}