import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { StageService } from '../../../services/stage.service';
import { CommentaireRapport } from '../../../models/stage.model';
import { SortByKeyPipe } from '../../../../app/sort-by-key.pipe';

@Component({
  selector: 'app-rapport-commentaires',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    DatePipe,
    SortByKeyPipe
  ],
  template: `
    <div class="mb-3">
      <input [formControl]="filterEtudiant"
             class="form-control"
             placeholder="Filtrer par nom/prénom étudiant" />
    </div>

    <div *ngIf="!commentaires.length" class="text-center text-muted">
      Aucun commentaire trouvé.
    </div>

    <ng-container *ngFor="let entry of grouped | sortByKey">
      <h5>Commentaires pour le rapport #{{ entry.key }}</h5>

      <div *ngFor="let c of entry.value" class="card mb-2">
        <div class="card-body">
          <p class="mb-1">{{ c.texte }}</p>
          <small class="text-secondary">
            — {{ c.encadrant.prenom }} {{ c.encadrant.nom }},
              {{ c.dateCreation | date:'short' }}
          </small>
        </div>
      </div>

      <div class="input-group mb-4">
        <textarea [formControl]="newComment"
                  class="form-control"
                  rows="2"
                  placeholder="Votre commentaire…"></textarea>
        <button class="btn btn-primary"
                (click)="envoyer(entry.key)">
          Envoyer
        </button>
      </div>
    </ng-container>
  `,
  styles: [`
    .mb-3 { margin-bottom:1rem; }
    .card { border-radius:.5rem; }
    .input-group { gap:.5rem; }
  `]
})
export class RapportCommentairesComponent implements OnInit {
  filterEtudiant = new FormControl('');
  commentaires: CommentaireRapport[] = [];
  grouped: { [rapportId: number]: CommentaireRapport[] } = {};
  newComment = new FormControl('');

  constructor(private stageSvc: StageService) {}

  ngOnInit(): void {
    this.filterEtudiant.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.loadCommentaires());
    this.loadCommentaires();
  }

  loadCommentaires(): void {
    const filt = this.filterEtudiant.value?.trim() || undefined;
    this.stageSvc.listCommentaires(filt).subscribe(list => {
      this.commentaires = list;
      this.grouped = {};
      list.forEach(c => {
        const id = c.rapport.id;
        (this.grouped[id] = this.grouped[id] || []).push(c);
      });
    });
  }

  envoyer(rapportId: number): void {
    const texte = this.newComment.value?.trim();
    if (!texte) return;
    this.stageSvc.addComment(rapportId, texte).subscribe(() => {
      this.newComment.reset();
      this.loadCommentaires();
    });
  }
}
