package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"
	"github.com/gin-gonic/gin"
)

var RoleRouter = RoleRoute{GroupName: "/api/roles"}

type RoleRoute struct{
	GroupName string
	RouterGroup *gin.RouterGroup
}

func (rt *RoleRoute) Init(router *gin.Engine){
	rt.RouterGroup = router.Group(rt.GroupName)
	{
		   
            rt.RouterGroup.GET("/",auth.CheckUserLoged,rt.GetAllRole())
			rt.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
			rt.RouterGroup.POST("",rt.CreateRole())
			rt.RouterGroup.PUT("",rt.UpdateRole())
			rt.RouterGroup.DELETE("",rt.DeleteRole())
	}
}
//get all role 
func (rt *RoleRoute) GetAllRole() gin.HandlerFunc{
	return RoleHandlers.Get()
}
//adll role
func (rt *RoleRoute) CreateRole() gin.HandlerFunc{
	return RoleHandlers.CreateRole()
}

//update role
func (rt *RoleRoute) UpdateRole() gin.HandlerFunc{
	return RoleHandlers.UpdateRole()
}

//delete role
func (rt *RoleRoute) DeleteRole() gin.HandlerFunc{
	return RoleHandlers.DeleteRole()
}