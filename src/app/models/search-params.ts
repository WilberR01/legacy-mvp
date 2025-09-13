export interface BasicSearchParams {
    text?: string | null;
    categoryId?: number | null;
    reputation?: number | null;
}

export interface DynamicSearchParams {
    quantity: number;
    categories: number[];
    types: number[];
    minDifficulty: number;
    maxDifficulty: number;
    minReputation: number;
    maxReputation: number;
}