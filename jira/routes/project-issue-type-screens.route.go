package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ProjectIssueTypeScreensRouter = ProjectIssueTypeScreensRoute{GroupName: "/api/project-issue-type-screens"}

type ProjectIssueTypeScreensRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *ProjectIssueTypeScreensRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		u.RouterGroup.Use(auth.CheckUserLoged)
		u.RouterGroup.GET("/", u.Get())
		//u.RouterGroup.GET("/:id", u.GetById())
		u.RouterGroup.POST("/", u.Create())
		u.RouterGroup.DELETE("/:id", u.Delete())
	}

}

func (u *ProjectIssueTypeScreensRoute) Get() gin.HandlerFunc {
	return ProjectIssueTypeScreensHandlers.Get()
}

func (u *ProjectIssueTypeScreensRoute) GetById() gin.HandlerFunc {
	return ProjectIssueTypeScreensHandlers.GetById()
}

func (u *ProjectIssueTypeScreensRoute) Create() gin.HandlerFunc {
	return ProjectIssueTypeScreensHandlers.Create()
}

func (u *ProjectIssueTypeScreensRoute) Delete() gin.HandlerFunc {
	return ProjectIssueTypeScreensHandlers.Delete()
}
