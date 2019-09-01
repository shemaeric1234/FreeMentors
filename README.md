# FreeMentors
Free Mentors is a social initiative where accomplished professionals become role models to
young people to provide free mentorship sessions.

you can visite this Free Mentor project on [Free Mentors](https://shemaeric1234.github.io/FreeMentors/UI/index.html)


[![Coverage Status](https://coveralls.io/repos/github/shemaeric1234/FreeMentors/badge.svg?branch=develop)](https://coveralls.io/github/shemaeric1234/FreeMentors?branch=develop) [![Build Status](https://travis-ci.org/shemaeric1234/FreeMentors.svg?branch=develop)](https://travis-ci.org/shemaeric1234/FreeMentors) [![Maintainability](https://api.codeclimate.com/v1/badges/165d0542cf8309b68090/maintainability)](https://codeclimate.com/github/shemaeric1234/FreeMentors/maintainability)


##### UI temporary credential

|     User Type     |     User Name    |      Password    |
| ----------- | -------------------- | ------------------- |
|Mentee | mentee@gmail.com | mentee |
|Mentor |mentor@gmail.com  | mentor|
|Admin|admin@gmail.com| admin|

##### UI important links

>[Home page](https://shemaeric1234.github.io/FreeMentors/UI/index.html)

>[Mentee welcome page](https://shemaeric1234.github.io/FreeMentors/UI/html/users_welcome_page.html)

>[Mentor welcome](https://shemaeric1234.github.io/FreeMentors/UI/html/mentors_welcome_page.html)

>[Admin welcome page ](https://shemaeric1234.github.io/FreeMentors/UI/html/admin_welcome_page.html)



#### Frontend tools
- HTML
- CSS
- Javascript


### Backend Tools used
 - Server side Framework: [Node/Express](https://expressjs.com/)
 - Linting Library: [esLint](https://eslint.org/)
 - Style Guide: [Airbnb](https://github.com/airbnb/javascript)
 - Testing Framework: [Mocha](https://mochajs.org/) [Chai](https://www.npmjs.com/package/chai)
 


### Available endpoints
|     URL     |     HTTP Methods     |     Description     |
| ----------- | -------------------- | ------------------- |
|API/v1/auth/ | GET | Get all mentee |
|API/v1/auth/:id | GET  | Get a specific mentee |
|API/v1/auth/signup | POST | Create a new mentee|
|API/v1/auth/signin | POST | Allow users to sign in |
|API/v1/mentors|GET|Get all Mentors|
|API/v1/mentor/:mentorId |GET| Get a specific Mentor |
|API/v1/user/:userId |POST|Changes mentee to be a mentor|
|API/v1/sessions| POST |Create a new mentor session|
|API/v1/sessions| GET |Get all Sessions |
|API/v1/sessions/:sessionId/:decision|PATCH|Accept or Reject a session|
|API/v1/sessions/:sessionId/review|POST|veviewing a mentor session|
|API/v1/sessions/:sessionId/review|DELETE|Delete a specific review|
|API/v1/reviewedsessions|GET|Get all session reviewed|


#### Host online
 - Github pages [home page](https://shemaeric1234.github.io/FreeMentors/UI/index.html)
 - Pivot Tracker story [stories](https://www.pivotaltracker.com/n/projects/2385592)

### Prequesite for project
- Nodejs [environment](https://nodejs.org/en/)
- Text Editor [Microsoft Visual studio code](https://code.visualstudio.com/)
- Github bash [terminal](https://git-scm.com/downloads) 
- Postman API [development](https://www.getpostman.com/)


### Installation
- visit the repository on [github](https://github.com/shemaeric1234/FreeMentors)
- clone the repository in terminal
- `cd FreeMentors`  to navigate inside repository

### Start Application
update packages by installing dependencies
 >npm install

start local server of application on `PORT 3000`
>npm run dev

### API URL
Now, app running locally to access resources we run endpoints on below URL.

` Example http://localhost:3000/API/v1/auth/signup `


### Test App
App are designed with Test Driven Development, we can check app to see how it works.
>npm test

### Version
- The FreeMentorsis `v1.0.0`

### License
- Issued by **SHEMA Eric**
- Free open source

