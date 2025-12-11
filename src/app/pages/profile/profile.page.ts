// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Preferences } from '@capacitor/preferences'; // Zum Speichern der Einstellung
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonToggle, IonItem, IonLabel, 
  IonList, IonListHeader 
} from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';

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
  isNotificationsEnabled: boolean = false;
  
  constructor() { }

  async ngOnInit() {
    await this.loadDarkModeState();
    await this.checkNotificationStatus();
  }

  private async checkNotificationStatus() {
    const permission = await LocalNotifications.checkPermissions();
    this.isNotificationsEnabled = permission.display === 'granted';
  }

  async toggleNotifications(event: any) {
    const enabled = event.detail.checked;
    
    if (enabled) {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display === 'granted') {
        this.scheduleReadingReminder();
        this.isNotificationsEnabled = true;
      } else {
        this.isNotificationsEnabled = false;
        alert('Permission denied. Please enable notifications in device settings.');
      }
    } else {
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      this.isNotificationsEnabled = false;
    }
  }

  private async scheduleReadingReminder() {
    // Erstellt eine tägliche Erinnerung um 18:00 Uhr
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Ollie Reminder",
          body: "Time to read! Your book is waiting for you.",
          id: 1, // Wichtige ID zum späteren Löschen
          schedule: {
            // Jeden Tag um 18:00 Uhr
            repeats: true, 
            every: 'day',
            on: { hour: 18, minute: 0 }
          }
        }
      ]
    });
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