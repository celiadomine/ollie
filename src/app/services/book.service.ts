import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Book, BookInsert } from '../data/Book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private supabase: SupabaseClient;
  private tableName: string = 'book'; 

  constructor() {
    this.supabase = createClient(
      environment.supabaseURL, 
      environment.supabaseKey
    );
  }

  async getBooks(): Promise<Book[] | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('title', { ascending: false })


    if (error) {
      console.error('Error fetching books:', error);
      return null;
    }
    return data as Book[];
  }

  async createBook(bookData: BookInsert) {
    const insertData = {
        ...bookData,
        total_reading_time: 0,
        current_page: 0,
        rating: bookData.rating || 0 
    };
    
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }
    return data as Book;
  }
  
  async addReadingProgress(bookId: string, newPage: number, timeSpentSeconds: number) {
    
    // 1. Hole das aktuelle Buch, um die alte Gesamtzeit zu kennen
    const { data: currentBook, error: fetchError } = await this.supabase
        .from('book')
        .select('total_reading_time') // WICHTIG: Nur das notwendige Feld holen
        .eq('id', bookId)
        .single();
    
    if (fetchError || !currentBook) {
        throw new Error('Could not fetch current reading time to calculate total.');
    }
    
    // 2. Berechne die neue Gesamtzeit
    const oldTime = currentBook.total_reading_time || 0;
    const newTotalTime = oldTime + timeSpentSeconds;
    
    // 3. Führe das Update aus
    const { data, error: updateError } = await this.supabase
        .from('book')
        .update({
            current_page: newPage, // Die neue Seite wird überschrieben
            total_reading_time: newTotalTime // Die akkumulierte Gesamtzeit wird gespeichert
        })
        .eq('id', bookId)
        .select();

    if (updateError) {
        throw updateError;
    }
    return data;
}

  async updateBookDetails(bookId: string, updates: Partial<BookInsert>) {
    // updates enthält nur die Felder, die sich geändert haben (z.B. status, genre, current_page)
    const { data, error } = await this.supabase
        .from('book')
        .update(updates)
        .eq('id', bookId)
        .select();

    if (error) {
        throw error;
    }
    return data;
}

  async markAsRead(bookId: string, finalPage: number, rating: number, reviewText: string) {
    const { data, error } = await this.supabase
        .from('book')
        .update({
            status: 'Read',
            current_page: finalPage,
            rating: rating,
            review_text: reviewText
        })
        .eq('id', bookId)
        .select();

    if (error) {
        throw error;
    }
    return data;
  }

  async deleteBook(bookId: string) {
    const { error } = await this.supabase
        .from('book')
        .delete()
        .eq('id', bookId);
        
    if (error) {
        throw error;
    }
    return true;
}
}