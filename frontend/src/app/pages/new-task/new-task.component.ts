import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  listId!: string;
  showTitleError = false; // Flag to show/hide the title error message

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
    });
  }

  onTitleFocus() {
    // Reset the error state when the input is focused
    this.showTitleError = false;
  }

  onTitleBlur(value: string) {
    // Set the error state if the input is empty when the user leaves it
    this.showTitleError = !value.trim();
  }

  createTask(title: string) {
    // Check if the title is not empty
    if (!title.trim()) {
      console.error('Task title cannot be empty.');
      return;
    }

    this.taskService.createTask(title, this.listId).subscribe((newTask: Task) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  cancelButtonClick() {
    this.router.navigate(['/lists', this.listId]);
  }
}
