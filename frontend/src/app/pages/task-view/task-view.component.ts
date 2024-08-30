import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit{

  lists!: any[];
  tasks!: any[];

  constructor(private taskService: TaskService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const listId = params['listId'];
      console.log('Route parameters:', params); // Additional logging
      if (listId) {
        console.log('Fetching tasks for listId:', listId);
        this.taskService.getTasks(listId).subscribe(
          (tasks: any[]) => {
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
      (lists: any[]) => {
        this.lists = lists;
        console.log('Lists fetched:', lists);
      },
      (error) => {
        console.error('Error fetching lists:', error);
      }
    );
  }
  
}
