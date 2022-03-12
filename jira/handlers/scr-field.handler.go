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

var ScrFieldHandlers = ScrFieldHandler{}

type ScrFieldHandler struct{}

func (sf *ScrFieldHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var fId, sId string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		fId = fmt.Sprintf("%v", myMap["field_id"])
		sId = fmt.Sprintf("%v", myMap["screen_id"])
		if fId == "" || sId == "" {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "The parameters are not enough"})
		} else {
			screen_id, _ := strconv.Atoi(sId)
			field_id, _ := strconv.Atoi(fId)
			if _, err := models.ScrFieldModels.Insert(models.ScrField{ScreenId: screen_id, FieldId: field_id}); err == nil {
				c.JSON(http.StatusOK, MessageResponse{Msg: "Field and screen has been linked"})
			} else {
				fmt.Println(err)
				c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
			}
		}
	}
}
