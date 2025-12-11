// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Preferences } from '@capacitor/preferences'; // Zum Speichern der Einstellung
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonToggle, IonItem, IonLabel, 
  IonList, IonListHeader 
} from '@ionic/angular/standalone';

const DARK_MODE_KEY = 'darkMode';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonToggle, IonItem, 
    IonLabel, IonList, IonListHeader
  ]
})
export class ProfilePage implements OnInit {
  
  isDarkMode: boolean = false;
  
  constructor() { }

  async ngOnInit() {
    await this.loadDarkModeState();
  }

  private async loadDarkModeState() {
    const { value } = await Preferences.get({ key: DARK_MODE_KEY });
    this.isDarkMode = value === 'true';
    this.toggleDarkClass(this.isDarkMode);
  }

  async toggleDarkMode(event: any) {
    this.isDarkMode = event.detail.checked;
    this.toggleDarkClass(this.isDarkMode);
    await Preferences.set({ key: DARK_MODE_KEY, value: this.isDarkMode.toString() });
  }

  private toggleDarkClass(enabled: boolean) {
    document.body.classList.toggle('dark', enabled);
  }
}