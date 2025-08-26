


// import { Component, OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { RouterModule } from "@angular/router"
// import { StageService } from "../../../services/stage.service"
// import { ToastService } from "../../../services/toast.service"
// import { NavbarComponent } from "../../shared/navbar/navbar.component"
// import { Rapport } from "../../../models/stage.model"
// import { CommentaireRapport } from '../../../models/stage.model';

// @Component({
//   selector: "app-rapport-list",
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
//   templateUrl: './rapport-list.component.html',
//   styleUrls: ['./rapport-list.component.scss']
// })
// export class RapportListComponent implements OnInit {
//   rapports: Rapport[] = []
//   filteredRapports: Rapport[] = []
//   commentaires: { [key: number]: string } = {}
//   loading = false
//   searchTerm = ""
//   statusFilter = ""

//   constructor(
//     private stageService: StageService,
//     private toastService: ToastService
//   ) {}

//   // ngOnInit(): void {
//   //   this.loadRapports()

//   //   setTimeout(() => {
//   //     this.animateElements()
//   //   }, 100)
//   // }

//   ngOnInit(): void {
//   this.loadRapports();
// }

// private loadRapports(): void {
//   this.loading = true;
//   this.stageService.getRapportsForEncadrant().subscribe({
//     next: rapports => {
//       this.rapports = rapports;
//       this.filteredRapports = [...rapports];
//       this.loading = false;
//       this.loadCommentairesExistants();
//     },
//     error: err => { /*…*/ }
//   });
// }

// private loadCommentairesExistants(): void {
//   // Pour chaque rapport, on charge les commentaires précédents
//   this.rapports.forEach(r => {
//     this.stageService.listCommentaires()  // sans filtre pour l'encadrant
//       .subscribe(list => {
//         // filtrer par rapportId
//         this.commentairesExistants[r.stageId] =
//           list.filter(c => c.rapport.id === r.stageId);
//       });
//   });
// }




//   filterRapports(): void {
//     this.filteredRapports = this.rapports.filter(rapport => {
//       const matchesSearch = !this.searchTerm || 
//         rapport.nom.toLowerCase().includes(this.searchTerm.toLowerCase())

//       const matchesStatus = !this.statusFilter || rapport.etat === this.statusFilter

//       return matchesSearch && matchesStatus
//     })
//   }


//   envoyerCommentaire(rapport: Rapport): void {
//   const texte = this.nouveauCommentaire[rapport.stageId]?.trim();
//   if (!texte) {
//     this.toastService.warning('Veuillez saisir un commentaire');
//     return;
//   }

//   this.stageService
//     .addComment(rapport.stageId, texte)
//     .subscribe({
//       next: c => {
//         // on l’ajoute en tête de la liste locale
//         this.commentairesExistants[rapport.stageId] =
//           [c, ...(this.commentairesExistants[rapport.stageId]||[])];
//         this.nouveauCommentaire[rapport.stageId] = '';
//         this.toastService.success('Commentaire envoyé');
//       },
//       error: _ => this.toastService.error('Échec envoi commentaire')
//     });
// }


//   getStatusClass(etat: string): string {
//     const classMap: { [key: string]: string } = {
//       "EN_ATTENTE": "badge-warning",
//       "VALIDE": "badge-success",
//       "REFUSE": "badge-error"
//     }
//     return classMap[etat] || "badge-secondary"
//   }

//   getStatusText(etat: string): string {
//     const statusMap: { [key: string]: string } = {
//       "EN_ATTENTE": "En attente",
//       "VALIDE": "Validé",
//       "REFUSE": "Refusé"
//     }
//     return statusMap[etat] || etat
//   }

// downloadReport(rapport: Rapport): void {
//   if (!rapport.cloudinaryUrl) {
//     this.toastService.error('URL du rapport non disponible');
//     return;
//   }

//   // Solution 100% frontend - contourne tous les problèmes backend
//   const downloadLink = document.createElement('a');
  
//   // Créer une URL avec paramètre de forçage PDF
//   const downloadUrl = `${rapport.cloudinaryUrl}?fl_attachment=rapport.pdf`;
  
//   downloadLink.href = downloadUrl;
//   downloadLink.target = '_blank';
//   downloadLink.download = this.getSafeFileName(rapport.nom || 'rapport_stage');
  
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
// }

// private getSafeFileName(fileName: string): string {
//   // Supprime les caractères spéciaux et ajoute .pdf
//   let safeName = fileName
//     .replace(/[^a-zA-Z0-9._-]/g, '_')
//     .replace(/\s+/g, '_');
  
//   if (!safeName.toLowerCase().endsWith('.pdf')) {
//     safeName += '.pdf';
//   }
  
//   return safeName;
// }
  

//   validateReport(rapportId: number): void {
//     const commentaire = this.commentaires[rapportId] || ""
//     this.stageService.validateRapport(rapportId, commentaire).subscribe({
//       next: (_: any) => {
//         this.loadRapports()
//         this.commentaires[rapportId] = ""
//         this.toastService.success("Rapport validé avec succès!")
//       },
//       error: (error: any) => {
//         this.toastService.error("Erreur lors de la validation du rapport")
//         console.error("Erreur lors de la validation:", error)
//       }
//     })
//   }

//   rejectReport(rapportId: number): void {
//     const commentaire = this.commentaires[rapportId]
//     if (!commentaire) {
//       this.toastService.warning("Veuillez ajouter un commentaire pour justifier le rejet.")
//       return
//     }

//     this.stageService.rejectRapport(rapportId, commentaire).subscribe({
//       next: (_: any) => {
//         this.loadRapports()
//         this.commentaires[rapportId] = ""
//         this.toastService.success("Rapport rejeté avec succès!")
//       },
//       error: (error: any) => {
//         this.toastService.error("Erreur lors du rejet du rapport")
//         console.error("Erreur lors du rejet:", error)
//       }
//     })
//   }

//   private animateElements(): void {
//     const items = document.querySelectorAll('.rapport-item')
//     items.forEach((item, index) => {
//       setTimeout(() => {
//         item.classList.add('animate-slideInFromBottom')
//       }, index * 100)
//     })
//   }


// commentairesExistants: Record<number, CommentaireRapport[]> = {};
// // pour saisir le nouveau commentaire
// nouveauCommentaire: { [rapportId: number]: string } = {};
// }

import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { StageService } from "../../../services/stage.service"
import { ToastService } from "../../../services/toast.service"
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component"
import { RapportDetails, CommentaireRapport } from '../../../models/stage.model'

@Component({
  selector: "app-rapport-list",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './rapport-list.component.html',
  styleUrls: ['./rapport-list.component.scss']
})
export class RapportListComponent implements OnInit {
  rapports: RapportDetails[] = []
  filteredRapports: RapportDetails[] = []
  commentaires: { [key: number]: string } = {}
  loading = false
  searchTerm = ""
  statusFilter = ""
   departementFilter = ""
  classeGroupeFilter = ""
  anneeScolaireFilter = ""
  departementOptions: string[] = []
  classeGroupeOptions: string[] = []
  anneeScolaireOptions: string[] = []

  commentairesExistants: Record<number, CommentaireRapport[]> = {}
  nouveauCommentaire: { [rapportId: number]: string } = {}

  constructor(
    private stageService: StageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRapports()
  }

  private loadRapports(): void {
   this.loading = true
    this.stageService.getRapportsForEncadrant().subscribe({
      next: (rapports: RapportDetails[]) => {
        this.rapports = rapports
        this.filteredRapports = [...rapports]
        this.loading = false
        this.loadCommentairesExistants()
        
        // Initialiser les options des filtres
        this.initializeFilterOptions()
      },
      error: (err) => {
        this.loading = false
        this.toastService.error("Erreur de chargement des rapports")
        // console.error("Erreur lors du chargement des rapports:", err)
      }
    })
  }

   private initializeFilterOptions(): void {
    // Récupérer les valeurs uniques pour chaque filtre
    this.departementOptions = [...new Set(this.rapports.map(r => r.departementNom))].sort()
    this.classeGroupeOptions = [...new Set(this.rapports.map(r => r.classeGroupeNom))].sort()
    this.anneeScolaireOptions = [...new Set(this.rapports.map(r => r.anneeScolaireValeur))].sort()
  }


  private loadCommentairesExistants(): void {
    this.rapports.forEach(r => {
      this.stageService.listCommentaires()
        .subscribe({
          next: (list) => {
            this.commentairesExistants[r.rapportId] = 
              list.filter(c => c.rapport.id === r.rapportId)
          },
          error: (err) => {
            // console.error("Erreur chargement commentaires:", err)
          }
        })
    })
  }
filterRapports(): void {
    this.filteredRapports = this.rapports.filter(rapport => {
      const matchesSearch = !this.searchTerm || 
        rapport.nomFichier.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesStatus = !this.statusFilter || rapport.etat === this.statusFilter
      
      const matchesDepartement = !this.departementFilter || 
        rapport.departementNom === this.departementFilter
        
      const matchesClasseGroupe = !this.classeGroupeFilter || 
        rapport.classeGroupeNom === this.classeGroupeFilter
        
      const matchesAnneeScolaire = !this.anneeScolaireFilter || 
        rapport.anneeScolaireValeur === this.anneeScolaireFilter

      return matchesSearch && matchesStatus && matchesDepartement && 
             matchesClasseGroupe && matchesAnneeScolaire
    })
  }

   resetFilters(): void {
    this.searchTerm = ""
    this.statusFilter = ""
    this.departementFilter = ""
    this.classeGroupeFilter = ""
    this.anneeScolaireFilter = ""
    this.filterRapports()
  }

  envoyerCommentaire(rapport: RapportDetails): void {
    const texte = this.nouveauCommentaire[rapport.rapportId]?.trim()
    if (!texte) {
      this.toastService.warning('Veuillez saisir un commentaire')
      return
    }

    this.stageService
      .addComment(rapport.rapportId, texte)
      .subscribe({
        next: (c) => {
          // Ajoute le nouveau commentaire en tête de liste
          if (!this.commentairesExistants[rapport.rapportId]) {
            this.commentairesExistants[rapport.rapportId] = []
          }
          this.commentairesExistants[rapport.rapportId] = [c, ...this.commentairesExistants[rapport.rapportId]]
          this.nouveauCommentaire[rapport.rapportId] = ''
          this.toastService.success('Commentaire envoyé')
        },
        error: (_) => this.toastService.error('Échec envoi commentaire')
      })
  }

  getStatusClass(etat: string): string {
    const classMap: { [key: string]: string } = {
      "EN_ATTENTE": "badge-warning",
      "VALIDE": "badge-success",
      "REFUSE": "badge-error"
    }
    return classMap[etat] || "badge-secondary"
  }

  getStatusText(etat: string): string {
    const statusMap: { [key: string]: string } = {
      "EN_ATTENTE": "En attente",
      "VALIDE": "Validé",
      "REFUSE": "Refusé"
    }
    return statusMap[etat] || etat
  }

  downloadReport(rapport: RapportDetails): void {
    if (!rapport.cloudinaryUrl) {
      this.toastService.error('URL du rapport non disponible')
      return
    }

    const downloadLink = document.createElement('a')
    const downloadUrl = `${rapport.cloudinaryUrl}?fl_attachment=rapport.pdf`
    downloadLink.href = downloadUrl
    downloadLink.target = '_blank'
    downloadLink.download = this.getSafeFileName(rapport.nomFichier || 'rapport_stage')
    
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  private getSafeFileName(fileName: string): string {
    let safeName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_')
    
    if (!safeName.toLowerCase().endsWith('.pdf')) {
      safeName += '.pdf'
    }
    
    return safeName
  }

  validateReport(rapportId: number): void {
    const commentaire = this.commentaires[rapportId] || ""
    this.stageService.validateRapport(rapportId, commentaire).subscribe({
      next: (_: any) => {
        this.loadRapports()
        this.commentaires[rapportId] = ""
        this.toastService.success("Rapport validé avec succès!")
      },
      error: (error: any) => {
        this.toastService.error("Erreur lors de la validation du rapport")
        // console.error("Erreur lors de la validation:", error)
      }
    })
  }

  rejectReport(rapportId: number): void {
    const commentaire = this.commentaires[rapportId]
    if (!commentaire) {
      this.toastService.warning("Veuillez ajouter un commentaire pour justifier le rejet.")
      return
    }

    this.stageService.rejectRapport(rapportId, commentaire).subscribe({
      next: (_: any) => {
        this.loadRapports()
        this.commentaires[rapportId] = ""
        this.toastService.success("Rapport rejeté avec succès!")
      },
      error: (error: any) => {
        this.toastService.error("Erreur lors du rejet du rapport")
        // console.error("Erreur lors du rejet:", error)
      }
    })
  }
}