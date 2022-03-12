package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var StatussRouter = StatussRoute{GroupName: "/api/statuss"}

type StatussRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *StatussRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		u.RouterGroup.Use(auth.CheckUserLoged)

		u.RouterGroup.GET("/", u.Get())
		u.RouterGroup.POST("", u.CreateStatus())
		u.RouterGroup.PUT("", u.UpdateStatus())
		u.RouterGroup.DELETE("", u.DeleteStatus())
	}

}

func (u *StatussRoute) Get() gin.HandlerFunc {

	return StatussHandlers.GetAllStatus()
}

func (u *StatussRoute) CreateStatus() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return StatussHandlers.CreateStatus()
}
func (u *StatussRoute) UpdateStatus() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return StatussHandlers.UpdateStatus()
}
func (u *StatussRoute) DeleteStatus() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return StatussHandlers.DeleteStatus()
}
