package handlers

import (
	"jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var PermissionRoleHandlers = PermissionRoleHandler{}

type PermissionRoleHandler struct{

}

//get all permission's role
func (pr *PermissionRoleHandler) GetAllPermissionRole() gin.HandlerFunc{
	return func(c *gin.Context) {
		id := c.Query("id")
		permission,err := models.PermissionRoleModels.GetAll(id)
		if err == nil{
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: permission})
		}else{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}
// check permission project
func CheckPermissionUserInProject(key_project string, id_user int, action_permission int) (bool){
	permission_list, err := models.PermissionModels.GetPermissionUserInProject(key_project,id_user)
	if err != nil{
		return false
	}else{
		for i:=0; i< len(permission_list); i++{
            if permission_list[i].PermissionId == action_permission{
               return true
			}
		}
		return false
	}

}