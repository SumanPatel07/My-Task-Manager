import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {
  listId!: string;
  currentTitle: string = ''; // Variable to hold the current list title
  showTitleError = false; // Flag to track if the title is empty

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
      this.loadList(); // Load the list data when initializing
    });
  }

  loadList() {
    this.taskService.getParticularList(this.listId).subscribe((list: List) => {
      this.currentTitle = list.title; // Set the current title
    }, error => {
      console.error('Error loading list:', error);
    });
  }

  onInputChange(value: string) {
    this.showTitleError = !value.trim(); // Validate on input change
  }

  onTitleFocus() {
    this.showTitleError = false; // Hide error message on focus
  }

  onTitleBlur(value: string) {
    this.showTitleError = !value.trim(); // Validate on blur
  }

  cancelButtonClick() {
    this.router.navigate(['/lists', this.listId]);
  }

  updateList(title: string) {
    if (this.showTitleError || !title.trim()) {
      console.error('List title cannot be empty.');
      return;
    }

    // Send the updated title
    this.taskService.updateList(this.listId, title).subscribe(() => {
      // Redirect to the specific list page after updating
      this.router.navigate([`/lists/${this.listId}`]);
    }, error => {
      console.error('Error updating list:', error);
    });
  }
}
