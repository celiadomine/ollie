import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { BookInsert } from 'src/app/data/Book'; // Nehmen Sie an, dass BookInsert existiert
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
  IonInput, IonLabel, IonButton, IonAlert, IonSelect, IonSelectOption 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
    IonInput, IonLabel, IonButton, IonAlert, IonSelect, IonSelectOption
  ]
})
export class LibraryPage implements OnInit {
  
  newBook: BookInsert = {
    title: '',
    author: '',
    total_pages: 0,
    genre: '',
    format: 'physical',
    status: 'Currently reading' // Standardmäßig auf Lesen setzen
  };

  // Status und Meldungen
  showAlert: boolean = false;
  alertMessage: string = '';
  
  constructor(private bookService: BookService) { }

  ngOnInit() {}

  async addBook() {
    // Einfache Validierung
    if (!this.newBook.title || !this.newBook.author || this.newBook.total_pages <= 0) {
      this.alertMessage = 'Please fill in Title, Author, and Total Pages.';
      this.showAlert = true;
      return;
    }

    try {
      await this.bookService.createBook(this.newBook);
      this.alertMessage = `Book "${this.newBook.title}" successfully added and set to "Currently reading"!`;
      this.showAlert = true;
      
      // Formular zurücksetzen
      this.newBook = {
        title: '',
        author: '',
        total_pages: 0,
        genre: '',
        format: 'physical',
        status: 'Currently reading'
      };

    } catch (error) {
      this.alertMessage = 'Error adding book. Check console.';
      this.showAlert = true;
      console.error(error);
    }
  }
}