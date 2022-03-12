package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var TransitionsRouter = TransitionsRoute{GroupName: "/api/transitions"}

type TransitionsRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *TransitionsRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		u.RouterGroup.Use(auth.CheckUserLoged)
		u.RouterGroup.GET("/", u.GetAllTransition())
		u.RouterGroup.POST("", u.CreateTransition())
		u.RouterGroup.PUT("", u.UpdateTransition())
		u.RouterGroup.DELETE("", u.DeleteTransition())
		u.RouterGroup.GET("", u.GetByIdWorkflow())
	}

}

func (u *TransitionsRoute) GetAllTransition() gin.HandlerFunc {

	return TransitionsHandlers.GetAllTransition()
}

func (u *TransitionsRoute) CreateTransition() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return TransitionsHandlers.CreateTransition()
}

func (u *TransitionsRoute) UpdateTransition() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return TransitionsHandlers.UpdateTransition()
}

func (u *TransitionsRoute) DeleteTransition() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return TransitionsHandlers.DeleteTransition()
}
func (u *TransitionsRoute) GetByIdWorkflow() gin.HandlerFunc {

	return TransitionsHandlers.GetByIdWorkflow()
}

// func (u *ProjectsRoute) Login(cxt *gin.Context) {

// }
