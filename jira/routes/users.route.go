package routes

import (
	"jira/common/middleware/auth"

	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var UserRouter = UserRoute{GroupName: "/api/users"}

type UserRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *UserRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
	
		u.RouterGroup.POST("/sign-up",auth.CheckUserLoged, auth.CheckAdmin, u.Signup())
		u.RouterGroup.GET("/",auth.CheckUserLoged,u.Index())
		u.RouterGroup.DELETE("/delete-user",auth.CheckUserLoged, auth.CheckAdmin, u.DeleteUser())
		u.RouterGroup.PUT("/admin/update-user",auth.CheckUserLoged, auth.CheckAdmin,u.UpdateUserByAdmin())
		u.RouterGroup.POST("/",u.Singin())
		u.RouterGroup.POST("/logout",auth.CheckUserLoged,auth.Logout)
		u.RouterGroup.POST("/refresh",auth.RefreshToken)
		u.RouterGroup.GET("/info-user-id",auth.CheckUserLoged,u.GetUserbyId())
		u.RouterGroup.GET("/info-user",auth.CheckUserLoged,u.GetInfoUserByToken())
        u.RouterGroup.POST("/upload-image",u.UpdateImage())
	}
}

//Register User by admin
func (u *UserRoute) Signup() gin.HandlerFunc {
	return UserHandlers.CreateUser()
}

//View All User
func (u *UserRoute) Index() gin.HandlerFunc {
	return UserHandlers.Index()
}

//Delete User
func (u *UserRoute) DeleteUser() gin.HandlerFunc {
	return UserHandlers.DeleteUser()
}

//Update User by Admin
func (u *UserRoute) UpdateUserByAdmin() gin.HandlerFunc {
	return UserHandlers.UpdateUser()
}

//Login User
func (u *UserRoute) Singin() gin.HandlerFunc {
	return UserHandlers.Singin()
}
func (u *UserRoute) GetUserbyId() gin.HandlerFunc{
	return UserHandlers.GetUserbyId()
}

func (u *UserRoute) GetInfoUserByToken() gin.HandlerFunc {
	//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return UserHandlers.GetUserbyTokenUser()
}
func (u *UserRoute) UpdateImage() gin.HandlerFunc{
	return UserHandlers.StoreImage()
}

