package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	. "jira/common/middleware/auth"

	"github.com/gin-gonic/gin"
)

var IssuesHandlers = IssuesHandler{}

type IssuesHandler struct {
}

func (u *IssuesHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		tokenAuth, err := ExtractTokenMetadata(c.Request)
		issues, err := models.IssuesModels.Get(tokenAuth.UserId, tokenAuth.GlobalRole)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issues,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) GetByProject() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		project := c.Param("project")
		issues, err := models.IssuesModels.GetByProject(project)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issues,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) CreateInit() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		projectIssueTypeScreens, err := models.IssuesModels.CreateInit()
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: projectIssueTypeScreens,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		issues, err := models.IssuesModels.GetById(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: issues,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issues,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) GetAllCustomFieldsOfScreen() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		customFields, err := models.IssuesModels.GetAllCustomFieldsOfScreen(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: customFields,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: customFields,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) GetUserList() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		project := c.Param("project")
		UserList, err := models.IssuesModels.GetUserList(project)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: UserList,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: UserList,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenAuth, err := ExtractTokenMetadata(c.Request)
		body := c.Request.Body
		issues, err := models.IssuesModels.Create(body, tokenAuth.UserId)
		if issues == nil && err == nil {
			c.JSON(http.StatusForbidden, MessageResponse{Msg: "You don't have a permission"})
		} else if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issues[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
	}
}

func (u *IssuesHandler) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		tokenAuth, err := ExtractTokenMetadata(c.Request)
		body := c.Request.Body
		issues, err := models.IssuesModels.Update(body, id, tokenAuth.UserId)
		if issues == nil && err == nil {
			c.JSON(http.StatusForbidden, MessageResponse{Msg: "You don't have a permission"})
		} else if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issues[0],
				//Data: issues,
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
	}
}

func (u *IssuesHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		tokenAuth, err := ExtractTokenMetadata(c.Request)
		issues, err := models.IssuesModels.Delete(id, tokenAuth.UserId)
		if issues == nil && err == nil {
			c.JSON(http.StatusForbidden, MessageResponse{Msg: "You don't have a permission"})
		} else if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Delete Successfully!",
				Data: issues[0],
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
