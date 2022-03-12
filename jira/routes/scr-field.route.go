package routes

import (
	"jira/common/middleware/auth"
	"jira/handlers"

	"github.com/gin-gonic/gin"
)

var ScrFieldRouter = ScrFieldRoute{GroupName: "/api/screen-field"}

type ScrFieldRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (sf *ScrFieldRoute) Init(router *gin.Engine) {
	sf.RouterGroup = router.Group(sf.GroupName)
	{
		sf.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
		sf.RouterGroup.PUT("/", sf.Create())
	}
}

func (sf *ScrFieldRoute) Create() gin.HandlerFunc {
	//sf.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return handlers.ScrFieldHandlers.Create()
}
