package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var TransitionStatusRouter = TransitionStatusRoute{GroupName: "/api/transition"}

type TransitionStatusRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (pr *TransitionStatusRoute) Init(router *gin.Engine) {
	pr.RouterGroup = router.Group(pr.GroupName)
	{
		pr.RouterGroup.Use(auth.CheckUserLoged)
		pr.RouterGroup.GET("/transition-status", pr.GetStatusTransitionRouter())
		pr.RouterGroup.POST("update", pr.UpdateStatusToTransition())
		pr.RouterGroup.DELETE("delete-status", pr.DeleteTransitionStatus())
		pr.RouterGroup.POST("", pr.AddStatusToTransition())
	}
}

//get all transition
func (pr *TransitionStatusRoute) GetStatusTransitionRouter() gin.HandlerFunc {

	return TransitionStatusHandlers.GetAllTransitionStatus()
}
func (pr *TransitionStatusRoute) UpdateStatusToTransition() gin.HandlerFunc {

	return TransitionStatusHandlers.UpdateTransitionStatus()
}
func (pr *TransitionStatusRoute) DeleteTransitionStatus() gin.HandlerFunc {

	return TransitionStatusHandlers.DeleteTransitionStatus()
}
func (pr *TransitionStatusRoute) AddStatusToTransition() gin.HandlerFunc {

	return TransitionStatusHandlers.AddStatusToTransition()
}
