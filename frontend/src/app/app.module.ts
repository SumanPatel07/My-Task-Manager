// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor.service';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { BodyComponent } from './SideNav/body/body.component';
import { SidenavComponent } from './SideNav/sidenav/sidenav.component';
import { StatisticsComponent } from './SideNav/statistics/statistics.component';
import { SettingsComponent } from './SideNav/settings/settings.component';
import { SublevelMenuComponent } from './SideNav/sidenav/sublevel-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotesListComponent } from './Notes/pages/notes-list/notes-list.component';
import { MainLayoutComponent } from './Notes/pages/main-layout/main-layout.component';
import { NoteCardComponent } from './Notes/note-card/note-card.component';
import { NoteDetailsComponent } from './Notes/pages/note-details/note-details.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginPageComponent,
    SignupPageComponent,
    EditListComponent,
    EditTaskComponent,
    BodyComponent,
    SidenavComponent,
    StatisticsComponent,
    SettingsComponent,
    SublevelMenuComponent,
    NotesListComponent,
    MainLayoutComponent,
    NoteCardComponent,
    NoteDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WebReqInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
