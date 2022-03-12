package routes

import (
	"jira/common/middleware"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type Route interface {
	Init(*gin.Engine)
}

var router = gin.Default()

var routes []Route

func init() {
	routes = append(routes,
		// ************add new route
		&UserRouter,
		//&IssueRouter,
		//&ScreenRouter,
		//&FieldRouter,
		//&ScrFieldRouter,
		//&ProScreenRouter,
		&RoleRouter,
		&ProjectsRouter,
		&CustomFieldsRouter,
		&ScreensRouter,

		&PermissionRouter,
		&PermissionRoleRouter,
		&ScreenCustomFieldsRouter,
		&IssueTypesRouter,
		&ProjectIssueTypeScreensRouter,
		&IssuesRouter,
		&ProjectUserRoleRouter,

		&WorkflowsRouter,
		&TransitionsRouter,
		&StatussRouter,
		&WorkflowProjectRouter,
		&TransitionStatusRouter,
	)
}

func InitRoutes() *gin.Engine {
	router.Use(middleware.LogRequestToFile)
	router.Use(middleware.CORS)
	for _, it := range routes {
		it.Init(router)
	}
    router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK,"123")
	})
	router.Use(static.Serve("/", static.LocalFile("../frontend/build", true)))
	router.LoadHTMLGlob("../frontend/build/*.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	return router
}
