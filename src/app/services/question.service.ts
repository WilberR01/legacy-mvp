import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';
import { BasicSearchParams, DynamicSearchParams } from '../models/search-params';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    createQuestion(question: Question): Observable<any> {
        return this.http.post(`${this.apiUrl}/questions`, question);
    }

    createQuestionsBulk(questions: Question[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/questions/bulk`, questions);
    }

    searchQuestions(params: BasicSearchParams): Observable<Question[]> {
        let httpParams = new HttpParams();
        if (params.text) {
            httpParams = httpParams.set('text', params.text);
        }
        if (params.categoryId) {
            httpParams = httpParams.set('categoryId', params.categoryId.toString());
        }
        if (params.reputation) {
            httpParams = httpParams.set('reputation', params.reputation.toString());
        }

        return this.http.get<Question[]>(`${this.apiUrl}/questions/search`, { params: httpParams });
    }

    dynamicSearch(params: DynamicSearchParams): Observable<Question[]> {
        return this.http.post<Question[]>(`${this.apiUrl}/questions/dynamic-search`, params);
    }

    deleteQuestion(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/questions/${id}`);
    }
}
