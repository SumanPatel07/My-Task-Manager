# Frontend
git status
git add .
git commit -m "comment"
git push
--ng build --output-path=dist/frontend --base-href "https://SumanPatel07.github.io/My-Task-manager/"  


ng build --configuration production --base-href "/My-Task-Manager/"

npx angular-cli-ghpages --dir=dist/frontend

Step 1 - ng add angular-cli-ghpages
Step 2 - push Code to githubRepo
Step 3 - go to repo setting and select main branch and save
Step 4 - build application using below cmd
      ng build --base-href "https://SumanPatel07.github.io/My-Task-Manager/"
            ng build --base-href "https://_githubProfileName_.github.io/_repoName_/"

Step 5 - publish your build changes from your local folder to github pages with below cmd
   npx angular-cli-ghpages --dir=dist/My-Task-Manager
Step 6 -  go to repo setting and select gh-pages branch and save

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

ng build --output-path=dist --base-href=/My-Task-manager/ --deploy-url=/My-Task-manager/

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
