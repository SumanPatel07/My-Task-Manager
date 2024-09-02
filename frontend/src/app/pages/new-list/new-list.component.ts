import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent {
  showTitleError = false; // Flag to track if the title is empty
  listId: string | null = null; // Store listId if needed

  constructor(private taskService: TaskService, private router: Router) {}

  onInputChange(value: string) {
    this.showTitleError = !value.trim(); // Update the flag based on the input value
  }

  onTitleBlur(value: string) {
    this.showTitleError = !value.trim(); // Validate on blur
  }

  createList(title: string) {
    if (this.showTitleError) {
      console.error('List title cannot be empty.');
      return;
    }

    this.taskService.createList(title).subscribe((list: any) => {
      this.listId = list._id; // Save the created listId
      this.router.navigate(['/lists', this.listId]); // Redirect to the new list page
    });
  }

  cancelButtonClick() {
    debugger;
    if (this.listId) {
      this.router.navigate(['/lists', this.listId]); // Redirect to the list page if listId is available
    } else {
      this.router.navigate(['/lists']); // Fallback to lists overview if listId is not available
    }
  }
}
