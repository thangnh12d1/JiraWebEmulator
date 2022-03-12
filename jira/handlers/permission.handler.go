package handlers

import (
	// "encoding/json"
	// "fmt"
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"
	"github.com/gin-gonic/gin"
)

var PermissionHandlers = PermissionHandler{}

type PermissionHandler struct{

}
func (pr *PermissionHandler) GetAllPermission() gin.HandlerFunc{
	return func(c *gin.Context) {
		permission,err := models.PermissionModels.GetAllPermission()
		if err == nil{
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: permission})
		}else{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}

//func update
func (pr *PermissionHandler) UpdatePermission() gin.HandlerFunc{
	return func(c *gin.Context) {
		var idRolenew string
		idPermission := c.Query("idpermission")
        idRole := c.Query("idrow")
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		idRolenew = fmt.Sprintf("%v",myMap["idrole"])
		if idRolenew == " "{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "id are not enough"})

		} else{
			if _,err := models.PermissionRoleModels.UpdatePermissionRole(idRole,idPermission,idRolenew); err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update permission success"})
		}
	}
	}
}

//func delete role permission
func (pr *PermissionHandler) DeletePermissionRole() gin.HandlerFunc{
	return func(c *gin.Context) {
		idpermission := c.Query("idpermission")
        idrole := c.Query("idrow")
		if idpermission == " " || idrole == " "{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "idpermission and idrole not enough"})
		}else{
			exists_permissionrole,err := models.PermissionRoleModels.Check_Exist(idpermission,idrole)
			if err != nil{
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}else{
				if len(exists_permissionrole) == 0{
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Does not exist"})
				} else if len(exists_permissionrole)>0{
                   if _,err := models.PermissionRoleModels.DeletePermissionRole(idpermission,idrole); err != nil{
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
				   }else{
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
				   }
				}
			}
		}
	}
}



//add role to permission 
func (pr *PermissionHandler) AddRoleToPermission() gin.HandlerFunc{
   return func(c *gin.Context) {
	var idpermission,idrole string
	var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		idpermission = fmt.Sprintf("%v",myMap["idpermission"])
		idrole = fmt.Sprintf("%v",myMap["idrole"])
		if idpermission == " " || idrole ==" "{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			exists_permissionrole,err := models.PermissionRoleModels.Check_Exist(idpermission,idrole)
            if err != nil{
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			if len(exists_permissionrole) >0{
				c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Role Name already exists, please choose another role "})
			}
			if len(exists_permissionrole) == 0{
			  sm := models.PemissionRoleModel{}
			  if _,err := sm.AddRoleToPermission(idpermission,idrole); err != nil{
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			  }else{
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Add Role Success"})

			  }
			}
		}
   }
}
