import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists!: List[];
  tasks!: Task[];
  selectedListId!: string;

  @ViewChildren('taskBox') taskBoxes!: QueryList<ElementRef>;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const listId = params['listId'];
      if (listId) {
        this.selectedListId = listId;
        this.taskService.getTasks(listId).subscribe(
          (tasks: Task[]) => {
            this.tasks = tasks;
          },
          (error) => {
            console.error('Error fetching tasks:', error);
          }
        );
      }
    });

    this.taskService.getLists().subscribe(
      (lists: List[]) => {
        this.lists = lists;
      },
      (error) => {
        console.error('Error fetching lists:', error);
      }
    );
  }

  onTaskClick(task: Task, index: number) {
    const wasCompleted = task.completed;
    task.completed = !task.completed;

    this.taskService.complete(task).subscribe(() => {
      if (!wasCompleted && task.completed) {
        this.showConfettiOnTask(index);
      }
    });
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe(() => {
      this.router.navigate(['/lists']);
    });
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe(() => {
      this.tasks = this.tasks.filter(val => val._id !== id);
    });
  }

  showConfettiOnTask(index: number) {
    const confetti = (window as any).confetti;

    if (confetti) {
      const element = this.taskBoxes.toArray()[index].nativeElement;
      
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      function getConfettiOrigin() {
        const rect = element.getBoundingClientRect();
        return {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        };
      }

      const burstCount = Math.floor(Math.random() * 4) + 1;

      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: getConfettiOrigin(),
          });
        }, i * 500);
      }
    }
  }
}
