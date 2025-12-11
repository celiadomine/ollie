import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/data/Book';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonHeader, IonContent, IonCardSubtitle, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-current-read',
  templateUrl: './current-read.component.html',
  styleUrls: ['./current-read.component.scss'],
  imports: [IonTitle, IonToolbar, IonCardSubtitle, IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon],
  standalone: true,
})
export class CurrentReadComponent  implements OnInit {

  @Input() currentBook: Book | null = null;

  constructor() { }

  ngOnInit() {}

}
