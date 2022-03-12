package routes

import (
	"jira/common/middleware/auth"

	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ProjectUserRoleRouter = ProjectUserRoleRoute{GroupName:"/api/project-user-role"}
type ProjectUserRoleRoute struct{
    GroupName string
    RouterGroup *gin.RouterGroup
}
func (pr *ProjectUserRoleRoute) Init(router *gin.Engine) {
	pr.RouterGroup = router.Group(pr.GroupName)
	{
	  pr.RouterGroup.GET("",auth.CheckUserLoged,pr.getAll())
	  pr.RouterGroup.PUT("",auth.CheckUserLoged, pr.UpdateRoleUserInProject())
	  pr.RouterGroup.DELETE("",auth.CheckUserLoged,pr.DeleteUserForProject())
	  pr.RouterGroup.POST("",auth.CheckUserLoged,pr.AddUserRoleToProject())

	}
}
func (pr *ProjectUserRoleRoute) getAll() gin.HandlerFunc{
    return ProjectUserRoleHandlers.GetUserRoleInProject()
}
func (pr *ProjectUserRoleRoute) UpdateRoleUserInProject() gin.HandlerFunc{
	return ProjectUserRoleHandlers.UpdateRoleForUser()
}
func (pr *ProjectUserRoleRoute) DeleteUserForProject() gin.HandlerFunc{
	return ProjectUserRoleHandlers.DeleteUserForProject()
}
func (pr* ProjectUserRoleRoute) AddUserRoleToProject() gin.HandlerFunc{
	return ProjectUserRoleHandlers.AddUserRoleToProject()
}