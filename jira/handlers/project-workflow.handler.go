package handlers

import (
	// "encoding/json"
	// "fmt"
	"fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var WorkflowProjectHandlers = WorkflowProjectHandler{}

type WorkflowProjectHandler struct {
}

//get all workflow's project
func (pr *WorkflowProjectHandler) GetAllWorkflowProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		fmt.Println(id)
		workflow, err := models.WorkflowProjectModels.GetAllWorPro(id)
		fmt.Println(workflow)
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: workflow})
		} else {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}
