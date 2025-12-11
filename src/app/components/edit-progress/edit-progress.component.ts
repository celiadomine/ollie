// src/app/components/edit-progress/edit-progress.component.ts

import { Component, Input } from '@angular/core';
import { Book } from 'src/app/data/Book';
import { BookService} from 'src/app/services/book.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonItem, IonLabel, IonInput, ModalController, IonButtons,
  IonSelect, IonSelectOption // Wichtig: IonSelect und Option hinzufügen
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Für pipes wie titlecase

@Component({
  selector: 'app-edit-progress',
  templateUrl: './edit-progress.component.html',
  styleUrls: ['./edit-progress.component.scss'],
  imports: [
    CommonModule, FormsModule, 
    IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption // Importe aktualisiert
  ],
  standalone: true,
})
export class EditProgressComponent {
  
  @Input() book!: Book; 
  
  // Die Modelle spiegeln die aktuellen Daten wider (Seite & Zeit)
  newPageInput: number = 0;
  newTimeInputMinutes: number = 0;

  // Neue Modelle für Buchdetails
  newStatus: string = '';
  newGenre: string = '';
  newFormat: string = '';

  // Listen für Selects
  genres = ['Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction', 'Thriller', 'Mystery', 'Romance', 'Other'];
  formats = ['physical', 'ebook', 'audiobook'];
  statuses = ['Want to read', 'Currently reading', 'Read'];

  constructor(
    private modalCtrl: ModalController,
    private bookService: BookService
  ) {}

  ionViewWillEnter() {
    // Initialisiert alle Felder mit den aktuellen Buchwerten
    this.newPageInput = this.book.current_page;
    this.newTimeInputMinutes = Math.floor(this.book.total_reading_time / 60);
    
    // Initialisierung der neuen Felder
    this.newStatus = this.book.status;
    this.newGenre = this.book.genre;
    this.newFormat = this.book.format;
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async saveChanges() {
    if (this.newPageInput < 0 || this.newPageInput > this.book.total_pages) {
      alert('Page number is invalid.');
      return;
    }
    
    const timeInSeconds = this.newTimeInputMinutes * 60;
    
    const updates: any = {
      status: this.newStatus,
      genre: this.newGenre,
      format: this.newFormat,
      current_page: this.newPageInput,
      total_reading_time: timeInSeconds,
    };
    
    // Wenn der Status auf 'Read' gesetzt wird, sollte die Seite auf das Maximum gesetzt werden.
    if (this.newStatus === 'Read') {
        updates.current_page = this.book.total_pages;
    } 
    // Logik: Wenn der Status von 'Read' auf etwas anderes zurückgesetzt wird, muss die Seite erhalten bleiben
    // oder, falls die Seite 0 ist, auf 0 bleiben. Dies wird durch das newPageInput abgedeckt.
    
    try {
      await this.bookService.updateBookDetails(
        this.book.id, 
        updates
      );

      this.modalCtrl.dismiss(null, 'confirm'); 

    } catch (e) {
      console.error('Error updating manual book details:', e);
      alert('Error updating details.');
      this.modalCtrl.dismiss(null, 'error');
    }
  }
}