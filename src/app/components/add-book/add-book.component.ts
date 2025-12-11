import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { BookInsert } from 'src/app/data/Book'; // Nehmen wir an, Sie haben ein BookInsert Interface/Type

import { 
  ModalController,
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, 
  IonButtons, IonListHeader, IonToast, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookOutline } from 'ionicons/icons';

@Component({
  selector: 'app-book-add',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, 
    IonButtons, IonListHeader, IonToast, IonIcon]
})
export class AddBookComponent {

  newBook: BookInsert = { 
    title: '', 
    author: '', 
    genre: '', 
    format: 'physical', 
    status: 'Want to read', 
    total_pages: 0 
  };
  
  // Genres für die Auswahl
  genres = ['Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction', 'Thriller', 'Mystery', 'Romance', 'Other'];
  
  // Formate für die Auswahl
  formats = ['physical', 'ebook', 'audiobook'];

  // Status für die Auswahl
  statuses = ['Want to read', 'Currently reading', 'Read', 'Stopped'];

  constructor(
    private modalCtrl: ModalController,
    private bookService: BookService
  ) {
    addIcons({ bookOutline });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async addBook() {
    if (!this.newBook.title || !this.newBook.author || this.newBook.total_pages <= 0) {
      alert('Please fill in title, author, and total pages.');
      return;
    }
      
    try {
      // Setzt die Startseite auf 0, wenn es nicht sofort gelesen wird
      if (this.newBook.status === 'Currently reading') {
        // Das Dashboard geht davon aus, dass current_page = 0 ist, wenn man beginnt
      } else {
         // Stellt sicher, dass das Buch, das nicht gelesen wird, bei 0 beginnt
         this.newBook.current_page = 0; 
      }
      
      await this.bookService.createBook(this.newBook);
      this.modalCtrl.dismiss(null, 'confirm');

    } catch (e) {
      console.error('Error adding book:', e);
      alert('Error adding book. Please check the console for details.');
      // Bei Fehler Modal schließen, aber mit "error" Rolle
      this.modalCtrl.dismiss(null, 'error'); 
    }
  }
}