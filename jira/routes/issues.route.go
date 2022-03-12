package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var IssuesRouter = IssuesRoute{GroupName: "/api/issues"}

type IssuesRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *IssuesRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		u.RouterGroup.Use(auth.CheckUserLoged)
		u.RouterGroup.GET("/", u.Get())
		u.RouterGroup.GET("/:id", u.GetById())
		u.RouterGroup.GET("/init", u.CreateInit())
		u.RouterGroup.POST("/", u.Create())
		u.RouterGroup.PUT("/:id", u.Update())
		u.RouterGroup.DELETE("/:id", u.Delete())
		u.RouterGroup.GET("/getCustomFields/:id", u.GetAllCustomFieldsOfScreen())
		u.RouterGroup.GET("/getUserList/:project", u.GetUserList())
		//u.RouterGroup.GET("/getByProject/:project", u.GetByProject())

	}

}

func (u *IssuesRoute) Get() gin.HandlerFunc {
	return IssuesHandlers.Get()
}

func (u *IssuesRoute) GetByProject() gin.HandlerFunc {
	return IssuesHandlers.GetByProject()
}

func (u *IssuesRoute) CreateInit() gin.HandlerFunc {
	return IssuesHandlers.CreateInit()
}

func (u *IssuesRoute) GetById() gin.HandlerFunc {
	return IssuesHandlers.GetById()
}

func (u *IssuesRoute) GetAllCustomFieldsOfScreen() gin.HandlerFunc {
	return IssuesHandlers.GetAllCustomFieldsOfScreen()
}

func (u *IssuesRoute) GetUserList() gin.HandlerFunc {
	return IssuesHandlers.GetUserList()
}

func (u *IssuesRoute) Create() gin.HandlerFunc {
	return IssuesHandlers.Create()
}

func (u *IssuesRoute) Update() gin.HandlerFunc {
	return IssuesHandlers.Update()
}

func (u *IssuesRoute) Delete() gin.HandlerFunc {
	return IssuesHandlers.Delete()
}
