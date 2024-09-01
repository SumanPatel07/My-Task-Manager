import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit{

  lists!: List[];
  tasks!: Task[];

  selectedListId!: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const listId = params['listId'];
      console.log('Route parameters:', params); // Additional logging
      if (listId) {
        console.log('Fetching tasks for listId:', listId);
        this.selectedListId = params['listId'];
        this.taskService.getTasks(listId).subscribe(
          (tasks: Task[]) => {
            this.tasks = tasks;
            console.log('Tasks fetched:', tasks);
          },
          (error) => {
            console.error('Error fetching tasks:', error);
          }
        );
      } else {
        console.error('listId is undefined, route params:', params);
      }
    });
  
    this.taskService.getLists().subscribe(
      (lists: List[]) => {
        this.lists = lists;
        console.log('Lists fetched:', lists);
      },
      (error) => {
        console.error('Error fetching lists:', error);
      }
    );
  }
  
  onTaskClick(task: Task) {
    // we want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log("Completed successully!");
      task.completed = !task.completed;
    })
  }
  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }
}
