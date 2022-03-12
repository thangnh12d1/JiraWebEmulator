package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var IssueTypesHandlers = IssueTypesHandler{}

type IssueTypesHandler struct {
}

func (u *IssueTypesHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		issueTypes, err := models.IssueTypesModels.Get()
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
				Data: issueTypes,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssueTypesHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		issueTypes, err := models.IssueTypesModels.GetById(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: issueTypes,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issueTypes,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssueTypesHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		body := c.Request.Body
		issueTypes, err := models.IssueTypesModels.Create(body)

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
				Data: issueTypes[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *IssueTypesHandler) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		body := c.Request.Body
		issueTypes, err := models.IssueTypesModels.Update(body, id)

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
				Data: issueTypes[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
	}
}

func (u *IssueTypesHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		issueTypes, err := models.IssueTypesModels.Delete(id)
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
				Data: issueTypes[0],
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
