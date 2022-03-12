package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var CustomFieldsRouter = CustomFieldsRoute{GroupName: "/api/custom-fields"}

type CustomFieldsRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *CustomFieldsRoute) Init(router *gin.Engine) {
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

func (u *CustomFieldsRoute) Get() gin.HandlerFunc {
	return CustomFieldsHandlers.Get()
}

func (u *CustomFieldsRoute) GetById() gin.HandlerFunc {
	return CustomFieldsHandlers.GetById()
}

func (u *CustomFieldsRoute) Create() gin.HandlerFunc {
	return CustomFieldsHandlers.Create()
}

func (u *CustomFieldsRoute) Update() gin.HandlerFunc {
	return CustomFieldsHandlers.Update()
}

func (u *CustomFieldsRoute) Delete() gin.HandlerFunc {
	return CustomFieldsHandlers.Delete()
}
