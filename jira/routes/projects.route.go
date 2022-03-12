package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ProjectsRouter = ProjectsRoute{GroupName: "/api/projects"}

type ProjectsRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *ProjectsRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{

		u.RouterGroup.GET("/projectkey", u.GetProjectKey())
		//admin can view all project
		// trusted, member only can view their project 
		u.RouterGroup.GET("/", auth.CheckUserLoged, u.Get())
		// u.RouterGroup.GET("/:key",auth.CheckUserLoged, u.GetByKey())
		//Trusted or admin can create project
		u.RouterGroup.POST("/", auth.CheckUserLoged, auth.CheckTrusted, u.CreateProject())
		// Admin global or project lead can update project 
		u.RouterGroup.PUT("/:key", auth.CheckUserLoged, u.UpdateProject())
		//Admin global can delete all project
		// or project lead 
		u.RouterGroup.DELETE("/:key", auth.CheckUserLoged, auth.CheckTrusted, u.DeleteProject())
        
	}
}

func (u *ProjectsRoute) Get() gin.HandlerFunc {

	return ProjectsHandlers.Get()
}

func (u *ProjectsRoute) GetProjectKey() gin.HandlerFunc {

	return ProjectsHandlers.GetAllProjectKey()
}

func (u *ProjectsRoute) GetByIdWorkflow() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.GetByIdWorkflow()
}

func (u *ProjectsRoute) CreateProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.CreateProject()
}

func (u *ProjectsRoute) UpdateProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.UpdateProject()
}

func (u *ProjectsRoute) DeleteProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.DeleteProject()
}

// func (u *ProjectsRoute) Login(cxt *gin.Context) {

// }
