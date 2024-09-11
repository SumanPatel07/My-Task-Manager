import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Note } from 'src/app/Notes/shared/note.model';
import { NotesService } from 'src/app/Notes/shared/notes.service';
import { trigger, transition, style, animate, query, stagger} from '@angular/animations';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // ENTRY ANIMATION
      transition('void => *', [
        // Initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // we have to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        // we first want to animate the spacing (which includes height and margin)
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*',
        })),
        animate(68)
      ]),

      transition('* => void', [
        // first scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // then scale down back to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        // scale down and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        // then animate the spacing (which includes height, margin and padding)
        animate('150ms ease-out', style({
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          'margin-bottom': '0',
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;
  
  constructor(private notesService: NotesService) { }

  ngOnInit() {
    // we want to retrieve all notes from NotesService
    this.notes = this.notesService.getAll();
    //this.filteredNotes = this.notesService.getAll();
    this.filter('');
  }

  
  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }
 
  filter(query: string | null) {
    if (query === null) {
        // Handle the case where query is null, if needed
        this.filteredNotes = [];
        return;
    }

    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>(); // Initialize an empty array

    // Split query into individual terms
    let terms: string[] = query.split(' ');

    // Remove duplicate search terms
    terms = this.removeDuplicates(terms);

    // Compile all relevant results into the allResults array
    terms.forEach(term => {
        let results: Note[] = this.relevantNotes(term);
        allResults = [...allResults, ...results];
    });

    // Remove duplicate notes from allResults
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevancy
    this.sortByRelevancy(allResults);
    // Sort unique results by relevancy and assign to filteredNotes
    //this.filteredNotes = this.sortByRelevancy(uniqueResults);
}



  removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // loop through the input array and add the items to the set
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string) : Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]): Note[] {
    // Create an object to store counts of notes by their ID
    let noteCountObj:{ [key: number]: number } = {};

    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note);

      if(noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
    return this.filteredNotes;
  }
  onKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.filter(input.value);
  }

  generateNoteUrl(note: Note){
    let noteId = this.notesService.getId(note);
    return noteId;
  }

}
