package handlers

import (
	"encoding/json"
	"fmt"
	. "jira/common/helpers"
	"jira/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var ProScreenHandlers = ProScreenHandler{}

type ProScreenHandler struct{}

func (ps *ProScreenHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		//sId, pId, scrType := c.PostForm("screen_id"), c.PostForm("project_id"), c.PostForm("screen_type")
		var sId, pId, scrType string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		sId = fmt.Sprintf("%v", myMap["screen_id"])
		pId = fmt.Sprintf("%v", myMap["project_id"])
		scrType = fmt.Sprintf("%v", myMap["screen_type"])
		if sId == "" || pId == "" || scrType == "" {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "The parameters are not enough"})
		} else {
			screen_id, _ := strconv.Atoi(sId)
			project_id, _ := strconv.Atoi(pId)
			if _, err := models.ProScreenModels.Insert(models.ProScreen{screen_id, project_id, scrType}); err == nil {
				c.JSON(http.StatusOK, MessageResponse{Msg: "Project and screen has been linked"})
			} else {
				fmt.Println(err)
				c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
			}

		}
	}
}
