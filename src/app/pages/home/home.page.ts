import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/data/Book';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonIcon } from '@ionic/angular/standalone';
import { CurrentReadComponent } from 'src/app/components/current-read/current-read.component';
import { TimerFeatureComponent} from 'src/app/components/timer-feature/timer-feature.component';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from 'src/app/components/review/review.component';
import { EditProgressComponent } from 'src/app/components/edit-progress/edit-progress.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [ IonIcon, IonCardHeader, IonCard, IonCardContent, IonCardTitle, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, CurrentReadComponent, TimerFeatureComponent, CommonModule]
})
export class HomePage implements OnInit {
  currentBook: Book | null = null;

  constructor(
      private bookService: BookService,
      private modalCtrl: ModalController,
  ) { }
  
  ngOnInit() {
    this.loadCurrentBook();
  }
  
  async loadCurrentBook() {
    const allBooks = await this.bookService.getBooks(); 
    this.currentBook = allBooks ? allBooks.find(b => b.status === 'Currently reading') || null : null;
  }

  handleProgressUpdate() {
      this.loadCurrentBook();
  }
  
  async openReviewModal() {
    if (!this.currentBook) return;

    const modal = await this.modalCtrl.create({
      component: ReviewComponent,
      componentProps: {
        book: this.currentBook 
      }
    });

    await modal.present();
    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.loadCurrentBook(); // Lädt das Dashboard neu
    }
  }

}