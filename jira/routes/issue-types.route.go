package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var IssueTypesRouter = IssueTypesRoute{GroupName: "/api/issue-types"}

type IssueTypesRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *IssueTypesRoute) Init(router *gin.Engine) {
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

func (u *IssueTypesRoute) Get() gin.HandlerFunc {
	return IssueTypesHandlers.Get()
}

func (u *IssueTypesRoute) GetById() gin.HandlerFunc {
	return IssueTypesHandlers.GetById()
}

func (u *IssueTypesRoute) Create() gin.HandlerFunc {
	return IssueTypesHandlers.Create()
}

func (u *IssueTypesRoute) Update() gin.HandlerFunc {
	return IssueTypesHandlers.Update()
}

func (u *IssueTypesRoute) Delete() gin.HandlerFunc {
	return IssueTypesHandlers.Delete()
}
