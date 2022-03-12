# Jira Document

## API Backend

### Endpoint


| Resource | Route              | Method | Description          | Auth     | Param                                                   | Request Format | Response                                                    | http code  |
| :--------- | :------------------- | -------- | ---------------------- | ---------- | --------------------------------------------------------- | ---------------- | ------------------------------------------------------------- | ------------ |
| User     | api/users/         | POST   | Login                | Require  | user(text) password(text)                               | json           | JWT                                                         | 200        |
| Screen   | api/screens/       | GET    | Get list of  screens | Require  | none                                                    | -              | List of screens and the projects that were linked with them | 200 or 401 |
| Screen   | api/screens/{id}   | GET    | Get a screen         | Require  | id(number)                                              |                |                                                             |            |
| Screen   | api/screens/       | POST   | Create screen        | Require  | screen_name(text)<br />screen_des(text)                 | json           | Notify Message                                              | 200 or 400 |
| Screen   | api/screens/{id}   | PUT    | Update screen        | Require  | id(number)<br />screen_name(text)<br />screen_des(text) | json           | Notify Message                                              | 200 or 400 |
| Screen   | api/screens/{id}   | DELETE | Delete screen        | Require  | id(number)                                              |                | Notify Message                                              | 200 or 400 |
| Projects | /api/projects      | GET    | get list of projects | Require  | none                                                    | -              | list of projects                                            | 200 or 401 |
| Projects | /api/projects/{id} | GET    | get a project by id  | Require  | id of the project                                       | -              | a project                                                   | 200 or 401 |
| Projects | /api/projects      | POST   | create a project     | Require  | json object include feilds of the project               | json           | the project just created                                    | 201 or 401 |
| Projects | /api/projects/{id} | PUT    | update a project     | Require  | json object include feilds need to update               | json           | update success message                                      | 200 or 401 |
| Projects | /api/projects/{id} | DELETE | delete a project     | Required | id of the project need to be delete                     | -              | delete success message                                      | 200 or 401 |
| Issue | /api/issues | GET | get all issue | none | none |  json      |json object include feilds of the issue | 200 or 400
| Issue | /api/issues | GET | get an issue by ID | none | id(number) |  json  | Get data by ID Success | 200 or 400
| Issue | /api/issues | PUT | create an issue | none | none | json  | create issue success | 200 or 400
| Issue | /api/issues | POST | update an issue | none |id(number) |json  | update issue success | 200 or 400
| Issue | /api/issues | DELETE | delete an issue | none | id(number) | - | delete issue success | 200 or 400



Post body { param1: val1, param2: val2, .... }

### Example

ex: Login system at "https://api/users/", post body { user: "john", password: "@jh12!" }
