import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Note } from 'src/app/Notes/shared/note.model';
import { NotesService } from 'src/app/Notes/shared/notes.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  note!: Note;
  new!: boolean;
  noteId!: number;
  originalNote!: Note;

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params['id']) {
        this.noteId = +params['id'];
        this.notesService.get(this.noteId).subscribe((note: Note) => {
          this.note = { ...note }; // Clone the note to keep original state
          this.originalNote = { ...note }; // Store the original note for cancel functionality
        });
        this.new = false;
      } else {
        this.new = true;
      }
    });
  }

  onSubmit(form: NgForm) {
    console.log('Form values:', form.value); // Debug form values
    if (this.new) {
      this.notesService.add(form.value);
    } else {
      this.notesService.update(this.noteId, form.value.title, form.value.body);
    }
    //this.router.navigateByUrl('/');
    this.router.navigate(['/notes']);
  }

  cancel() {
    if (this.new) {
      // Navigate to home without saving if creating a new note
      //this.router.navigateByUrl('/');
      this.router.navigate(['/notes']);
    } else {
      // Reset the form to the original note if editing
      this.note = { ...this.originalNote };
      //this.router.navigateByUrl('/');
      this.router.navigate(['/notes']);
    }
  }
}
