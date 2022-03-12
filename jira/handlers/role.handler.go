package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var RoleHandlers = RoleHandler{}

type RoleHandler struct {
}

//get all role
func (rl *RoleHandler) Get() gin.HandlerFunc {
	return func(c *gin.Context) {
		//get model
		roles, err := models.RoleModels.GetAllRole()
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: roles})

		} else {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}

//create role
func (rl *RoleHandler) CreateRole() gin.HandlerFunc {
	return func(c *gin.Context) {
		var rolename, roledescription string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//role name from client
		rolename = fmt.Sprintf("%v", myMap["rolename"])
		//role descriprtion from client
		roledescription = fmt.Sprintf("%v", myMap["roledescription"])
		if rolename == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})

		} else {
			exists_role, err := models.RoleModels.Check_Role_Exist(rolename)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			}
			if len(exists_role) > 0 {
				c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Role Name already exists, please choose another role "})

			}
			if len(exists_role) == 0 {
				//add role
				src := models.Role{
					RoleName:        rolename,
					RoleDescription: roledescription,
				}
				sm := models.RoleModel{}
				if _, err := sm.AddRole(src); err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Add role Success"})
				}
			}

		}
	}
}

//Update role
func (rl *RoleHandler) UpdateRole() gin.HandlerFunc {
	return func(c *gin.Context) {
		var  roledescription, rolenamesub string
		 id := c.Query("id")
		var myMap map[string]string
		//req body from client
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//namerole
		//descriptionrole
		roledescription = fmt.Sprintf("%v", myMap["roledescription"])
		//convert id string -> id int
		//  role_id,_ := strconv.Atoi(id)
		//rolename change
		rolenamesub = fmt.Sprintf("%v", myMap["rolenamesub"])
		if id == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "id are not enough"})
		} else {
			exists_role, err := models.RoleModels.Check_Role_Exist_By_Id(id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			}
			if len(exists_role) == 0 {
				c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "No have role "})

			}
			if len(exists_role) >= 0 {
				if _, err := models.RoleModels.UpdateRole(exists_role[0].RoleId, rolenamesub, roledescription); err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
				} else {
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update role success"})
				}
			}
		}
	}
}

//delete role
func (rl *RoleHandler) DeleteRole() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		//id null
		if id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			//Check role exist
			exists_role, err := models.RoleModels.Check_Role_Exist_By_Id(id)
			//error query
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				//no have role
				if len(exists_role) == 0 {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Role Id does not exist"})
					//have role
				} else if len(exists_role) > 0 {
					if _, err := models.RoleModels.DeleteRole(id); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete role success"})
					}
				}
			}
		}

	}
}
