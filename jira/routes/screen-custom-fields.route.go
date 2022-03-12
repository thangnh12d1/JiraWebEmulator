package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ScreenCustomFieldsRouter = ScreenCustomFieldsRoute{GroupName: "/api/screen-custom-fields"}

type ScreenCustomFieldsRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *ScreenCustomFieldsRoute) Init(router *gin.Engine) {
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

func (u *ScreenCustomFieldsRoute) Get() gin.HandlerFunc {
	return ScreenCustomFieldsHandlers.Get()
}

func (u *ScreenCustomFieldsRoute) GetById() gin.HandlerFunc {
	return ScreenCustomFieldsHandlers.GetById()
}

func (u *ScreenCustomFieldsRoute) Create() gin.HandlerFunc {
	return ScreenCustomFieldsHandlers.Create()
}

func (u *ScreenCustomFieldsRoute) Update() gin.HandlerFunc {
	return ScreenCustomFieldsHandlers.Update()
}

func (u *ScreenCustomFieldsRoute) Delete() gin.HandlerFunc {
	return ScreenCustomFieldsHandlers.Delete()
}
