package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var WorkflowProjectRouter = WorkflowProjectRoute{GroupName: "/api/workflow"}

type WorkflowProjectRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (pr *WorkflowProjectRoute) Init(router *gin.Engine) {
	pr.RouterGroup = router.Group(pr.GroupName)
	{
		pr.RouterGroup.Use(auth.CheckUserLoged)
		pr.RouterGroup.GET("/", pr.GetAllWorkflow())
		pr.RouterGroup.POST("", pr.CreateWorkflow())
		pr.RouterGroup.DELETE("", pr.DeleteWorkflow())
		pr.RouterGroup.GET("/workflow-project", pr.GetProjectWorkflowRouter())
		pr.RouterGroup.PUT("", pr.UpdateWorkflow())

	}
}

func (u *WorkflowProjectRoute) GetAllWorkflow() gin.HandlerFunc {

	return WorkflowsHandlers.GetAllWorkflow()
}

func (u *WorkflowProjectRoute) CreateWorkflow() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return WorkflowsHandlers.CreateWorkflow()
}

func (u *WorkflowProjectRoute) DeleteWorkflow() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return WorkflowsHandlers.DeleteWorkflow()
}

//get all workflow
func (pr *WorkflowProjectRoute) GetProjectWorkflowRouter() gin.HandlerFunc {

	return WorkflowProjectHandlers.GetAllWorkflowProject()
}

func (u *WorkflowProjectRoute) UpdateWorkflow() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return WorkflowsHandlers.UpdateWorkflow()
}
