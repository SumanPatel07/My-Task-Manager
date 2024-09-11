import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Note } from './note.model'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();
  private storageKey = 'notes';

  constructor() { 
    this.loadNotes(); // Load notes from localStorage when the service is initialized
  }

  getAll(): Note[] {
    return this.notes;
  }

  get(id: number): Observable<Note> {
    const note = this.notes[id];
    return of(note);
  }

  getId(note: Note): number {
    return this.notes.indexOf(note);
  }

  add(note: Note): number {
    let newLength = this.notes.push(note);
    this.saveNotes(); // Save notes to localStorage after adding a new note
    let index = newLength - 1;
    return index;
  }

  update(id: number, title: string, body: string): void {
    let note = this.notes[id];
    if (note) {
      note.title = title;
      note.body = body;
      this.saveNotes(); // Save notes to localStorage after updating a note
    }
  }

  delete(id: number): void {
    this.notes.splice(id, 1);
    this.saveNotes(); // Save notes to localStorage after deleting a note
  }

  private loadNotes(): void {
    const storedNotes = localStorage.getItem(this.storageKey);
    if (storedNotes) {
      this.notes = JSON.parse(storedNotes);
    }
  }

  private saveNotes(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }
}
