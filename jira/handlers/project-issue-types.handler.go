package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var ProjectIssueTypeScreensHandlers = ProjectIssueTypeScreensHandler{}

type ProjectIssueTypeScreensHandler struct {
}

func (u *ProjectIssueTypeScreensHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		projectIssueTypeScreens, err := models.ProjectIssueTypeScreensModels.Get()
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

func (u *ProjectIssueTypeScreensHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		projectIssueTypeScreens, err := models.ProjectIssueTypeScreensModels.GetById(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: projectIssueTypeScreens,
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

func (u *ProjectIssueTypeScreensHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		body := c.Request.Body
		projectIssueTypeScreens, err := models.ProjectIssueTypeScreensModels.Create(body)

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
				Data: projectIssueTypeScreens[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *ProjectIssueTypeScreensHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		projectIssueTypeScreens, err := models.ProjectIssueTypeScreensModels.Delete(id)
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
				Msg:  "Delete Successfully!",
				Data: projectIssueTypeScreens[0],
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
