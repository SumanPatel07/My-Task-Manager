import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  listId!: string;
  taskId!: string;
  currentTitle: string = ''; // Variable to hold the current task title
  currentCompleted: boolean = false; // Variable to hold the current completion status
  showTitleError = false; // Flag to track if the title is empty

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
      this.taskId = params['taskId'];
      this.loadTask(); // Load the task data when initializing
    });
  }

  loadTask() {
    this.taskService.getParticularTask(this.listId, this.taskId).subscribe((task: Task) => {
      console.log('Loaded Task:', task); // Add this log to see the loaded task
      this.currentTitle = task.title; // Set the current title
      this.currentCompleted = task.completed; // Set the current completion status
      console.log('Current Completed Status:', this.currentCompleted); // Verify the status
    }, error => {
      console.error('Error loading task:', error);
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

  updateTask(title: string) {
    if (this.showTitleError || !title.trim()) {
      console.error('Task title cannot be empty.');
      return;
    }

    // Send the current completion status along with the updated title
    this.taskService.updateTask(this.listId, this.taskId, title, this.currentCompleted).subscribe(() => {
      this.router.navigate(['/lists', this.listId]);
    }, error => {
      console.error('Error updating task:', error);
    });
  }
}
