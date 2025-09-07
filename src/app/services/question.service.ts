import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    createQuestion(question: Question): Observable<any> {
        return this.http.post(`${this.apiUrl}/questions`, question);
    }

    deleteQuestion(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/questions/${id}`);
    }
}