package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var ScreenCustomFieldsHandlers = ScreenCustomFieldsHandler{}

type ScreenCustomFieldsHandler struct {
}

func (u *ScreenCustomFieldsHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		screenCustomFields, err := models.ScreenCustomFieldsModels.Get()
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
				Data: screenCustomFields,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *ScreenCustomFieldsHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		screenCustomFields, err := models.ScreenCustomFieldsModels.GetById(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: screenCustomFields,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: screenCustomFields,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *ScreenCustomFieldsHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		body := c.Request.Body
		screenCustomFields, err := models.ScreenCustomFieldsModels.Create(body)

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
				Data: screenCustomFields[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *ScreenCustomFieldsHandler) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		body := c.Request.Body
		screenCustomFields, err := models.ScreenCustomFieldsModels.Update(body, id)

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
				Data: screenCustomFields[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
	}
}

func (u *ScreenCustomFieldsHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		screenCustomFields, err := models.ScreenCustomFieldsModels.Delete(id)
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
				Data: screenCustomFields[0],
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
