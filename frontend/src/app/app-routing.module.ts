import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { AuthGuard } from './pages/AuthGuard';
import { NotesComponent } from './SideNav/Notes/notes.component';
import { MoodComponent } from './SideNav/mood/mood.component';
import { SettingsComponent } from './SideNav/settings/settings.component';
import { StatisticsComponent } from './SideNav/statistics/statistics.component';
import { NoteDetailsComponent } from './Notes/pages/note-details/note-details.component';
import { MainLayoutComponent } from './Notes/pages/main-layout/main-layout.component';
import { NotesListComponent } from './Notes/pages/notes-list/notes-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'new-list', component: NewListComponent, canActivate: [AuthGuard] },
  { path: 'new-task', component: NewTaskComponent, canActivate: [AuthGuard] },
  { path: 'edit-list/:listId', component: EditListComponent, canActivate: [AuthGuard] },
  { path: 'lists', component: TaskViewComponent, canActivate: [AuthGuard] },
  { path: 'lists/:listId', component: TaskViewComponent, canActivate: [AuthGuard] },
  { path: 'lists/:listId/new-task', component: NewTaskComponent, canActivate: [AuthGuard] },
  { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: TaskViewComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'mood', component: MoodComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'notes', component: MainLayoutComponent, children: [
    { path: '', component: NotesListComponent },
    { path: 'new', component: NoteDetailsComponent },
    { path: ':id', component: NoteDetailsComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
