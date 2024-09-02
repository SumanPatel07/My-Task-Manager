import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Task } from './models/task.model';
import { List } from './models/list.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  getLists(): Observable<any[]> {
    return this.webReqService.get<any[]>('lists');
  }

  createList(title: string): Observable<any> {
    return this.webReqService.post<any>('lists', { title });
  }

  updateList(id: string, title: string): Observable<List> {
    return this.webReqService.patch<List>(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string, completed: boolean): Observable<any> {
    return this.webReqService.patch<any>(`lists/${listId}/tasks/${taskId}`, { title, completed });
  }

  deleteTask(listId: string, taskId: string): Observable<any> {
    return this.webReqService.delete<any>(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string): Observable<any> {
    return this.webReqService.delete<any>(`lists/${id}`);
  }

  getTasks(listId: string): Observable<any[]> {
    return this.webReqService.get<any[]>(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string): Observable<any> {
    return this.webReqService.post<any>(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task): Observable<any> {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: task.completed
    });
  }

  getParticularTask(listId: string, taskId: string): Observable<Task> {
    return this.webReqService.get<Task>(`lists/${listId}/tasks/${taskId}`);
  }

  getParticularList(listId: string): Observable<List> {
    return this.webReqService.get<List>(`lists/${listId}`);
  }
}
