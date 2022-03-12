package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"
	"github.com/gin-gonic/gin"
)
var PermissionRoleRouter = PermissionRoleRoute{GroupName: "/api/permission"}
type PermissionRoleRoute struct{
	GroupName string
	RouterGroup *gin.RouterGroup
}
func (pr *PermissionRoleRoute) Init(router *gin.Engine){
	pr.RouterGroup = router.Group(pr.GroupName)
	{
    pr.RouterGroup.GET("/permission-role",auth.CheckUserLoged,auth.CheckTrusted,pr.GetRolePermissionRouter())
	
	}
}

//get all permission
func (pr *PermissionRoleRoute) GetRolePermissionRouter() gin.HandlerFunc{
  
   return PermissionRoleHandlers.GetAllPermissionRole()
}