import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, BookInsert } from 'src/app/data/Book';
import { BookService } from 'src/app/services/book.service';
import { ModalController, IonListHeader } from '@ionic/angular/standalone'; // Für Edit/Add Modals
// Neue Ionic Imports für Library
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
  IonLabel, IonButton, IonAlert, IonBadge, IonSegment, IonSegmentButton,
  IonFab, IonFabButton, IonIcon, IonButtons, IonModal 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

import { EditProgressComponent } from 'src/app/components/edit-progress/edit-progress.component'; 
// HINWEIS: Das Add Book Formular muss eine eigene Modal-Komponente werden (AddBookModalComponent)!

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [IonListHeader, 
    CommonModule, FormsModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
    IonLabel, IonButton, IonAlert, IonBadge, IonSegment, IonSegmentButton,
    IonFab, IonFabButton, IonIcon, IonButtons, IonModal, 
    EditProgressComponent // Importiert den Modal
    // AddBookModalComponent (muss noch erstellt werden)
  ]
})
export class LibraryPage implements OnInit {
  
  allBooks: Book[] = []; 
  filteredBooks: Book[] = []; 
  
  // Filter-Status
  selectedStatusFilter: 'all' | 'Currently reading' | 'Want to read' | 'Read' = 'all'; 

  // Modal-Zustand für das Hinzufügen
  isAddModalOpen: boolean = false; 

  showAlert: boolean = false;
  alertMessage: string = '';
  
  constructor(
    private bookService: BookService,
    private modalCtrl: ModalController
  ) {
    addIcons({ addOutline, createOutline, trashOutline });
  }

  async ngOnInit() {
    await this.loadBooks();
  }

  async loadBooks() {
    this.allBooks = await this.bookService.getBooks() || [];
    this.filterBooks(); // Filtert beim Laden
  }

  filterBooks() {
    if (this.selectedStatusFilter === 'all') {
      this.filteredBooks = this.allBooks;
    } else {
      this.filteredBooks = this.allBooks.filter(book => book.status === this.selectedStatusFilter);
    }
  }

  // --- DELETE FUNKTION ---
  async deleteBook(bookId: string) {
    if (confirm('Are you sure you want to delete this book permanently?')) {
      try {
        await this.bookService.deleteBook(bookId);
        await this.loadBooks(); // Liste neu laden
        this.alertMessage = 'Book deleted successfully.';
        this.showAlert = true;
      } catch (e) {
        this.alertMessage = 'Error deleting book.';
        this.showAlert = true;
        console.error(e);
      }
    }
  }

  // --- EDIT BUCH MODAL (Aktualisiert Status, Genre, etc.) ---
  async openEditBookModal(book: Book) {
    // Da wir das EditProgressModal bereits erstellt haben, verwenden wir es
    // und fügen später die Logik für Status/Genre-Änderungen hinzu.
    const modal = await this.modalCtrl.create({
      component: EditProgressComponent, // Wir verwenden das EditProgressModal auch für allgemeine Edits
      componentProps: {
        book: book
      }
    });

    await modal.present();
    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      await this.loadBooks();
      this.alertMessage = 'Book updated successfully.';
      this.showAlert = true;
    }
  }

  // HINWEIS: Die Logik zum Hinzufügen (addBook) muss jetzt in die neue Modal-Komponente verschoben werden!
}