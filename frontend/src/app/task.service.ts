import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';

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

  updateList(id: string, title: string): Observable<any> {
    return this.webReqService.patch<any>(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string): Observable<any> {
    return this.webReqService.patch<any>(`lists/${listId}/tasks/${taskId}`, { title });
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
}
