package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var CustomFieldsHandlers = CustomFieldsHandler{}

type CustomFieldsHandler struct {
}

func (u *CustomFieldsHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		customFields, err := models.CustomFieldsModels.Get()
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
				Data: customFields,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *CustomFieldsHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		customFields, err := models.CustomFieldsModels.GetById(id)
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

func (u *CustomFieldsHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		body := c.Request.Body
		customFields, err := models.CustomFieldsModels.Create(body)

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
				Data: customFields[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *CustomFieldsHandler) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		body := c.Request.Body
		customFields, err := models.CustomFieldsModels.Update(body, id)

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
				Data: customFields[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
	}
}

func (u *CustomFieldsHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		customFields, err := models.CustomFieldsModels.Delete(id)
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
				Data: customFields[0],
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
