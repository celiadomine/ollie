// src/app/modals/review-modal/review-modal.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Wichtig für ngModel
import { Book } from 'src/app/data/Book';
import { BookService } from 'src/app/services/book.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonItem, IonLabel, IonTextarea, IonInput, ModalController,
  IonRange, IonIcon, IonButtons, IonListHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review.component.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonItem, IonLabel, IonTextarea, IonInput, IonRange, 
    IonIcon, IonButtons, IonListHeader
  ]
})
export class ReviewComponent {
  
  // Das Buch, das aus der HomePage übergeben wird (als Input)
  @Input() book!: Book; 
  
  // Model für Review-Daten
  finalPage: number = 0;
  rating: number = 0;
  reviewText: string = '';

  constructor(
    private modalCtrl: ModalController,
    private bookService: BookService
  ) {
    addIcons({ star, starOutline });
  }

  ionViewWillEnter() {
    // Setzt die Seite beim Öffnen automatisch auf das Ende (kann angepasst werden)
    this.finalPage = this.book.total_pages; 
  }

  closeModal() {
    // Schließt das Modal ohne Aktion
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async finishReading() {
    // Null-Check und Validierung
    if (!this.book || this.finalPage < this.book.current_page || this.finalPage > this.book.total_pages) {
        alert('Please check the final page number.');
        return;
    }
      
    try {
      // Nutzt die Methode im BookService, um den Status zu aktualisieren
      await this.bookService.markAsRead(
        this.book.id, 
        this.finalPage, 
        this.rating, 
        this.reviewText
      );

      // Schließt das Modal und sendet 'confirm' zurück zur HomePage
      this.modalCtrl.dismiss(null, 'confirm');

    } catch (e) {
      console.error('Error marking book as read:', e);
      alert('Error marking book as read.');
    }
  }
}