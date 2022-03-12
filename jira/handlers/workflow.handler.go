package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
	//"github.com/godror/godror/odpi/src"
	_ "github.com/godror/godror"
)

var WorkflowsHandlers = WorkflowsHandler{}

type WorkflowsHandler struct {
}

func (u *WorkflowsHandler) GetAllWorkflow() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		workflows, err := models.WorkflowsModels.GetAllWorkflow()
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: workflows,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: workflows,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}
func (u *WorkflowsHandler) GetByIdWorkflow() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		id := c.Query("id")
		// loggers.Logger.Println("get a get request")
		workflows, err := models.WorkflowsModels.GetById(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: workflows,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: workflows,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

// TAO Workflow
func (u *WorkflowsHandler) CreateWorkflow() gin.HandlerFunc {
	return func(c *gin.Context) {
		var workflow_name, workflow_description string

		var myMapNew map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMapNew)

		workflow_name = fmt.Sprintf("%v", myMapNew["WorkflowName"])
		workflow_description = fmt.Sprintf("%v", myMapNew["WorkflowDescription"])
		fmt.Println(workflow_name)
		// Parameters are null
		if workflow_name == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_workflow, err := models.WorkflowsModels.Check_workflow(workflow_name)

			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running 1 query"})

			}
			if len(Exist_workflow) > 0 {

				c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Name already exists, please choose another Name"})

			}

			if len(Exist_workflow) == 0 {

				scr := models.Workflow{WorkflowName: workflow_name, WorkflowDescription: workflow_description}
				fmt.Println(scr)
				if _, err := models.WorkflowsModels.InsertWorkflow(scr); err != nil {
					fmt.Println(err)
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					fmt.Println(err)
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Create Workflow Success", Data: scr})
				}

			}
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}
func (u *WorkflowsHandler) UpdateWorkflow() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")

		body := c.Request.Body
		// fmt.Println(params[0])
		fmt.Println(body)
		message, err := models.WorkflowsModels.UpdateWorkflow(body, id)
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

		// json.NewDecoder(c.Request.Body).Decode(&book)

	}
}
func (u *WorkflowsHandler) DeleteWorkflow() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		fmt.Println(id)
		_, err := models.WorkflowsModels.DeleteWorkflow(id)

		if err != nil {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
		} else {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
		}
	}
}

// add project to workflow
func (u *WorkflowsHandler) AddProjectToWorkflow() gin.HandlerFunc {
	return func(c *gin.Context) {
		var idworkflow, idproject string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		idworkflow = fmt.Sprintf("%v", myMap["idworkflow"])
		idproject = fmt.Sprintf("%v", myMap["idproject"])
		fmt.Println(idworkflow)
		fmt.Println(idproject)
		if idworkflow == " " || idproject == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			exists_workflowproject, err := models.WorkflowProjectModels.Check_Exist(idworkflow, idproject)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			if len(exists_workflowproject) > 0 {
				if exists_workflowproject[0].WorkflowId != 0 {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Project already exists, please choose another project "})
				}

			}
			if len(exists_workflowproject) > 0 {
				if exists_workflowproject[0].WorkflowId == 0 {

					sm := models.WorkflowProjectModel{}
					fmt.Println(sm)
					fmt.Println(idworkflow)
					fmt.Println(idproject)
					if _, err := sm.AddProjectToWorkflow(idworkflow, idproject); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

					} else {
						if _, err := sm.DeleteIdWorkflowInWorkflowProject(idworkflow, idproject); err != nil {
							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success"})

					}
				}

			}
		}
	}
}

// func (u *WorkflowsHandler) UpdateWorkflowProject() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var idProjectnew string
// 		idWorkflow := c.Query("idorkflow")
// 		idProject := c.Query("idrow")
// 		var myMap map[string]string
// 		json.NewDecoder(c.Request.Body).Decode(&myMap)
// 		idProjectnew = fmt.Sprintf("%v", myMap["idproject"])
// 		if idProjectnew == " " {
// 			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "id are not enough"})

// 		} else {
// 			if _, err := models.WorkflowProjectModels.UpdateWorkflowProject(idProject, idWorkflow, idProjectnew); err != nil {
// 				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
// 			} else {
// 				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update Workflow success"})
// 			}
// 		}
// 	}
// }

//func delete Project Workflow
func (u *WorkflowsHandler) DeleteWorkflowProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		idworkflow := c.Query("idworkflow")
		idproject := c.Query("idrow")
		fmt.Println(idworkflow)
		fmt.Println(idproject)
		if idworkflow == " " || idproject == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "idWorkflow and idProject not enough"})
		} else {
			exists_WorkflowProject, err := models.WorkflowProjectModels.Check_Exist(idworkflow, idproject)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				if len(exists_WorkflowProject) == 0 {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Does not exist"})
				} else if len(exists_WorkflowProject) > 0 {
					if _, err := models.WorkflowProjectModels.DeleteWorkflowProject(idworkflow, idproject); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete project success"})
					}
				}
			}
		}
	}
}
