import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {
  refreshingAccessToken = false; // Flag to check if the token is being refreshed
  accessTokenRefreshed: Subject<void> = new Subject<void>(); // Subject to notify when the token is refreshed

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Add the authentication header to the outgoing request
    request = this.addAuthHeader(request);

    // Handle the request and the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Error encountered:', error);

        if (error.status === 401) {
          // If the error status is 401 (Unauthorized), try to refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Once the token is refreshed, add the new token to the request headers
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log('Error after attempting to refresh access token:', err);
              this.authService.logout(); // Log out the user if the refresh attempt fails
              return EMPTY; // Return an empty observable
            })
          );
        }

        // For other errors, propagate the error to the caller
        return throwError(() => error);
      })
    );
  }

  refreshAccessToken(): Observable<void> {
    if (this.refreshingAccessToken) {
      // If a refresh operation is already in progress, wait for it to complete
      return new Observable<void>((observer) => {
        this.accessTokenRefreshed.subscribe(() => {
          // When the token is refreshed, complete the observable
          observer.next();
          observer.complete();
        });
      });
    } else {
      // Start the token refresh process
      this.refreshingAccessToken = true;
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log('Access Token Refreshed!');
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next(); // Notify all subscribers that the token has been refreshed
        }),
        catchError((error) => {
          this.refreshingAccessToken = false;
          console.error('Failed to refresh access token:', error);
          return EMPTY;
        })
      );
    }
  }

  addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    // Get the access token from the AuthService
    const token = this.authService.getAccessToken();

    if (token) {
      // If the token exists, add it to the request headers
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    // Return the request unmodified if no token is available
    return request;
  }
}
