package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ScreensRouter = ScreensRoute{GroupName: "/api/screens"}

type ScreensRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *ScreensRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		u.RouterGroup.Use(auth.CheckUserLoged)
		u.RouterGroup.GET("/", u.Get())
		//u.RouterGroup.GET("/:id", u.GetById())
		u.RouterGroup.POST("/", u.Create())
		u.RouterGroup.PUT("/:id", u.Update())
		u.RouterGroup.DELETE("/:id", u.Delete())
	}

}

func (u *ScreensRoute) Get() gin.HandlerFunc {
	return ScreensHandlers.Get()
}

func (u *ScreensRoute) GetById() gin.HandlerFunc {
	return ScreensHandlers.GetById()
}

func (u *ScreensRoute) Create() gin.HandlerFunc {
	return ScreensHandlers.Create()
}

func (u *ScreensRoute) Update() gin.HandlerFunc {
	return ScreensHandlers.Update2()
}

func (u *ScreensRoute) Delete() gin.HandlerFunc {
	return ScreensHandlers.Delete()
}
