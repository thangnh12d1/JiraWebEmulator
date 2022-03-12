package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	. "jira/common/helpers"
	. "jira/common/middleware/auth"
	"jira/loggers"
	"jira/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	//"github.com/godror/godror/odpi/src"
	_ "github.com/godror/godror"
)

var ProjectsHandlers = ProjectsHandler{}

type ProjectsHandler struct {
}

func (u *ProjectsHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		//Check user để lấy project của user đó
		//Admin, Trusted load all
		//member check
		tokenAuth, err := ExtractTokenMetadata(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
		}
		if tokenAuth.GlobalRole == 0 {
			projects, err := models.ProjectsModels.Get()
			if err != nil {
				loggers.Logger.Errorln(err.Error())
				response := MessageResponse{
					Msg:  err.Error(),
					Data: projects,
				}
				c.JSON(http.StatusNotFound,
					response,
				)
			} else {
				response := MessageResponse{
					Msg:  "Successful",
					Data: projects,
				}
				c.JSON(http.StatusOK,
					response,
				)
			}
		}
		if tokenAuth.GlobalRole == 2 || tokenAuth.GlobalRole == 1 {
			projects, err := models.ProjectsModels.GetProjectUser(int(tokenAuth.UserId))
			fmt.Println(projects)
			if err != nil {
				loggers.Logger.Errorln(err.Error())
				response := MessageResponse{
					Msg:  err.Error(),
					Data: projects,
				}
				c.JSON(http.StatusNotFound,
					response,
				)
			} else {
				response := MessageResponse{
					Msg:  "Successful",
					Data: projects,
				}
				c.JSON(http.StatusOK,
					response,
				)
			}
		}
		// loggers.Logger.Println("get a get request")

	}
}
func (u *ProjectsHandler) GetAllProjectKey() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		projects, err := models.ProjectsModels.GetAllProjectKey()
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: projects,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: projects,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *ProjectsHandler) GetByIdWorkflow() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		projects, err := models.ProjectsModels.GetByIdWorkflow(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: projects,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: projects,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *ProjectsHandler) CreateProject() gin.HandlerFunc {
	return func(c *gin.Context) {

		//get user id
		tokenAuth, err := ExtractTokenMetadata(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		var project_key, project_name, project_description string
		var myMapNew map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMapNew)
		project_key = fmt.Sprintf("%v", myMapNew["ProjectKey"])
		project_name = fmt.Sprintf("%v", myMapNew["ProjectName"])
		project_description = fmt.Sprintf("%v", myMapNew["ProjectDescription"])
		// project_lead = fmt.Sprintf("%v", myMapNew["ProjectLead"])

		// Parameters are null
		if project_key == "" || project_name == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_project, err := models.ProjectsModels.Check_project(project_name, project_key)
			fmt.Println(Exist_project)
			fmt.Println("KKKK")
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running 1 query"})

			}
			if len(Exist_project) > 0 {
				if Exist_project[0].ProjectKey == project_key && Exist_project[0].ProjectName != project_name {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Key already exists, please choose another Key"})
				}
			}
			if len(Exist_project) > 0 {
				if Exist_project[0].ProjectKey != project_key && Exist_project[0].ProjectName == project_name {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Name already exists, please choose another Name"})
				}
			}
			if len(Exist_project) > 0 {
				if Exist_project[0].ProjectKey == project_key && Exist_project[0].ProjectName == project_name {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Key and Name already exists, please choose another Key and Name"})
				}
			}

			if len(Exist_project) == 0 {

				scr := models.Project{ProjectKey: project_key, ProjectName: project_name, ProjectDescription: project_description, ProjectLead: int(tokenAuth.UserId)}

				if _, err := models.ProjectsModels.InsertProject(scr); err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					scr1 := models.Project{ProjectKey: project_key}
					if _, err := models.ProjectsModels.InsertProjectInProjectWorkflow(scr1); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

					} else {
						//insert project lead to role admin

						user_id := strconv.FormatInt(tokenAuth.UserId, 10)
						sm := models.ProjectUserRoleModel{}
						if _, err := sm.AddUserRoleToProject(project_key, user_id, "241"); err != nil {
							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
						} else {
							//get new project
							projects, err := models.ProjectsModels.GetProjectLeadByKeyProject(project_key)
							if err != nil {
								c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
							} else {
								c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: projects[0]})
							}
						}

					}

					// err != nil {
					// 	loggers.Logger.Errorln(err.Error())
					// 	response := MessageResponse{
					// 		Msg:  err.Error(),
					// 		Data: nil,
					// 	}
					// 	c.JSON(http.StatusNotFound,
					// 		response,
					// 	)

					// }

				}
			}
		}

	}
}

//	//Admin global can delete all project
// or project lead can update project
func (u *ProjectsHandler) UpdateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")
		body := c.Request.Body
		tokenAuth, error := ExtractTokenMetadata(c.Request)
		if error != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
		}
		if CheckProjectLead(key, int(tokenAuth.UserId)) || tokenAuth.GlobalRole == 0 {
			// fmt.Println(params[0])
			message, err := models.ProjectsModels.UpdateProject(body, key)
			if err != nil {
				loggers.Logger.Errorln(err.Error())
				response := MessageResponse{
					Msg:  err.Error(),
					Data: nil,
				}
				c.JSON(http.StatusNotFound,
					response,
				)
			} else {
				response := MessageResponse{
					Msg:  message,
					Data: nil,
				}
				c.JSON(http.StatusOK,
					response,
				)
			}
		} else {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "you do not own this project"})
		}
	}
}

//Admin global can delete all project
// or project lead
func (u *ProjectsHandler) DeleteProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")

		tokenAuth, error := ExtractTokenMetadata(c.Request)
		if error != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
		}
		if CheckProjectLead(key, int(tokenAuth.UserId)) || tokenAuth.GlobalRole == 0 {
			_, err := models.ProjectsModels.DeleteProjectInWorkflow(key)
			if err != nil {
				loggers.Logger.Errorln(err.Error())
				response := MessageResponse{
					Msg:  err.Error(),
					Data: nil,
				}
				c.JSON(http.StatusBadRequest, response)
			} else {
				_, err := models.ProjectsModels.DeleteProject(key)
				//get userid
				if err != nil {
					loggers.Logger.Errorln(err.Error())
					response := MessageResponse{
						Msg:  err.Error(),
						Data: nil,
					}
					c.JSON(http.StatusNotFound,
						response,
					)
				} else {

				}
				response := MessageResponse{
					Msg:  "Delete Successfully!",
					Data: nil,
				}
				c.JSON(http.StatusOK,
					response,
				)

			}

		} else {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "you must Admin global or project lead"})
		}
	}

}

//check project lead
func CheckProjectLead(project_key string, id_user int) bool {
	projects, err := models.ProjectsModels.GetProjectLeadByKeyProject(project_key)
	if err != nil {
		return false
	} else {
		return projects[0].ProjectLead == id_user
	}

}
