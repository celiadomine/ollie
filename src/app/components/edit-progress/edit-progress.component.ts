import { Component, Input } from '@angular/core';
import { Book } from 'src/app/data/Book';
import { BookService} from 'src/app/services/book.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonItem, IonLabel, IonInput, ModalController, IonButtons } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-progress',
  templateUrl: './edit-progress.component.html',
  styleUrls: ['./edit-progress.component.scss'],
  imports: [IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonItem, IonLabel, IonInput, FormsModule ],
  standalone: true,
})

export class EditProgressComponent {
  
  @Input() book!: Book; 
  
  newPageInput: number = 0;
  newTimeInputMinutes: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private bookService: BookService
  ) {}

  ionViewWillEnter() {
    // Initialisiert die Felder mit den aktuellen Werten
    this.newPageInput = this.book.current_page;
    this.newTimeInputMinutes = Math.floor(this.book.total_reading_time / 60);
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async saveChanges() {
    if (this.newPageInput < this.book.current_page) {
      alert('The new page cannot be before the current page.');
      return;
    }
    
    const timeInSeconds = this.newTimeInputMinutes * 60;
    
    try {
      // Nutzt die updateProgress-Methode des BookService (die bereits Time und Page handhabt)
      // Wir setzen die Lesezeit hier auf den manuell eingegebenen Gesamtwert, nicht auf eine Differenz.
      await this.bookService.updateTotalProgress(
        this.book.id, 
        this.newPageInput, 
        timeInSeconds
      );

      this.modalCtrl.dismiss(null, 'confirm'); 

    } catch (e) {
      console.error('Error updating manual progress:', e);
      alert('Error updating progress.');
      this.modalCtrl.dismiss(null, 'error');
    }
  }
}