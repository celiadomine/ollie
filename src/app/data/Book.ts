export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    
    format: 'physical' | 'e book' | 'audiobook'; 
    status: 'Want to read' | 'Currently reading' | 'Read' | 'Stopped';
    total_pages: number | null;
    current_page: number; 
    total_reading_time: number; 
    
    cover_url: string | null; // Link zum Cover-Bild in Supabase Storage
    
    review_text: string | null;
    rating: number;
    
    created_at: string; 
}

export interface BookInsert {
    title: string;
    author: string;
    genre: string;
    format: 'physical' | 'ebook' | 'audio';
    status: 'Currently reading' | 'Read' | 'Planned';
    total_pages: number;
    // Die folgenden Felder werden im BookService auf Standardwerte gesetzt, 
    // müssen aber optional sein, falls die Logik sich ändert.
    current_page?: number; 
    total_reading_time?: number;
    rating?: number;
    user_id?: string | null;
    cover_url?: string | null;
    review_text?: string | null;
}