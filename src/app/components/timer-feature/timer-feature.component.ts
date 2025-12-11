// src/app/components/timer-feature/timer-feature.component.ts

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences'; 
import { BookService } from 'src/app/services/book.service';
import { Counter } from 'src/app/pipes/counter.pipes';
import { 
  IonCard, IonInput, IonButton, IonIcon, IonCardHeader, IonCardTitle, 
  IonCardContent, IonCardSubtitle, IonItem, IonLabel
} from '@ionic/angular/standalone';


// Konstanten für Preferences Keys
const TIMER_RUNNING_KEY = 'timerRunning';
const TIMER_START_TIME_KEY = 'timerStartTime';

@Component({
  selector: 'app-timer-feature',
  templateUrl: './timer-feature.component.html',
  styleUrls: ['./timer-feature.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonCard, IonInput, IonButton, IonIcon, IonCardHeader, IonCardTitle, 
    IonCardContent, IonCardSubtitle, IonItem, IonLabel, Counter
  ]
})
export class TimerFeatureComponent implements OnInit, OnDestroy {

  // Inputs von der HomePage
  @Input() bookId: string | undefined; 
  @Input() currentPage: number | undefined; 
  
  // Output an die HomePage, wenn der Fortschritt gespeichert wurde
  @Output() progressUpdated = new EventEmitter<void>(); 

  // Variablen für die Timer-Logik
  isTimerRunning: boolean = false;
  currentSessionTime: number = 0; // Zeit in Sekunden
  newPageInput: number | undefined; // Eingabefeld für die neue Seite

  private timerInterval: any;
  private startTime: number = 0; // UNIX-Timestamp der Startzeit

  constructor(private bookService: BookService) { }

  async ngOnInit() {
    this.newPageInput = this.currentPage; // Setzt den Input auf die aktuelle Seite

    // Lädt den Timer-Status beim Start der App
    await this.loadTimerState();
  }

  ngOnDestroy() {
    // Stoppt das Interval, wenn die Komponente zerstört wird, um Memory Leaks zu vermeiden
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // --- Lade- und Speicherfunktionen für den Timer-Status (mit Capacitor Preferences) ---

  private async loadTimerState() {
    const runningResult = await Preferences.get({ key: TIMER_RUNNING_KEY });
    const startTimeResult = await Preferences.get({ key: TIMER_START_TIME_KEY });

    this.isTimerRunning = runningResult.value === 'true';
    this.startTime = startTimeResult.value ? parseInt(startTimeResult.value, 10) : 0;

    if (this.isTimerRunning && this.startTime) {
      this.startTimerInterval();
    }
  }

  private async saveTimerState() {
    await Preferences.set({ key: TIMER_RUNNING_KEY, value: this.isTimerRunning.toString() });
    await Preferences.set({ key: TIMER_START_TIME_KEY, value: this.startTime.toString() });
  }

  private async clearTimerState() {
    await Preferences.remove({ key: TIMER_RUNNING_KEY });
    await Preferences.remove({ key: TIMER_START_TIME_KEY });
  }

  // --- Timer-Steuerung ---

  toggleTimer() {
    this.isTimerRunning = !this.isTimerRunning;

    if (this.isTimerRunning) {
      // START
      if (this.currentSessionTime === 0) {
        // Wenn der Timer neu startet, setzen Sie die Startzeit auf jetzt
        this.startTime = Date.now();
      } else {
        // Wenn der Timer nach einer Pause fortgesetzt wird, korrigieren Sie die Startzeit
        // (Wird bei dieser simplen Implementierung ignoriert, da wir nur die verstrichene Zeit zählen)
      }

      this.saveTimerState();
      this.startTimerInterval();
    } else {
      // PAUSE
      this.saveTimerState(); // Speichert den aktuellen Zustand (isTimerRunning=false)
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }
  }

  private startTimerInterval() {
    // Löscht alte Intervalle, falls vorhanden
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Aktualisiert die Zeit jede Sekunde
    this.timerInterval = setInterval(() => {
      if (this.startTime) {
        // Berechnet die verstrichene Zeit seit dem Start
        const elapsedMilliseconds = Date.now() - this.startTime;
        this.currentSessionTime = Math.floor(elapsedMilliseconds / 1000); // Zeit in Sekunden
      }
    }, 1000);
  }

  // --- Speicherung des Fortschritts ---

  async saveReadingProgress() {
    if (!this.bookId || !this.newPageInput) {
      console.error('Book ID or new page input is missing.');
      return;
    }
    
    // Konvertiert die aktuelle Sitzungszeit in Sekunden in eine ganze Zahl
    const timeSpentSeconds = this.currentSessionTime;
    
    try {
      // 1. Speichert Fortschritt und akkumuliert die Zeit in Supabase
      await this.bookService.updateProgress(
        this.bookId, 
        this.newPageInput, 
        timeSpentSeconds
      );

      // 2. Setzt den Timer zurück und löscht den Zustand
      this.currentSessionTime = 0;
      this.isTimerRunning = false;
      this.startTime = 0;
      this.newPageInput = this.currentPage;
      this.clearTimerState();
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      // 3. Informiert die HomePage, dass die Daten neu geladen werden müssen
      this.progressUpdated.emit();
      
      alert(`Progress saved! Read until page ${this.newPageInput}. Time added: ${timeSpentSeconds}s.`);
      
    } catch (e) {
      alert('Error saving progress. Check console for details.');
      console.error(e);
    }
  }
}