import { Component, Input } from '@angular/core';
import { Question } from '../../models/question';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../utils/material.module';

@Component({
  selector: 'app-item-busca',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './item-busca.component.html',
  styleUrls: ['./item-busca.component.scss']
})
export class ItemBuscaComponent {
  @Input() question!: Question;

  getDifficultyStars(): number[] {
    return Array(this.question.difficulty || 0).fill(0);
  }

  getEmptyStars(): number[] {
    return Array(5 - (this.question.difficulty || 0)).fill(0);
  }
}
