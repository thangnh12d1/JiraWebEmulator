package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"

	//"github.com/godror/godror/odpi/src"
	_ "github.com/godror/godror"
)

var StatussHandlers = StatussHandler{}

type StatussHandler struct {
}

func (u *StatussHandler) GetAllStatus() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		statuss, err := models.StatussModels.GetAllStatus()
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: statuss,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: statuss,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *StatussHandler) CreateStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		var status_description, status_name string

		var myMapNew map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMapNew)

		status_description = fmt.Sprintf("%v", myMapNew["StatusDescription"])
		//Status_url = fmt.Sprintf("%v",myMapNew["StatusUrl"])
		//Status_avatar = fmt.Sprintf("%v",myMapNew["StatusAvatar"])
		status_name = fmt.Sprintf("%v", myMapNew["StatusName"])

		// Parameters are null

		if status_name == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_Status, err := models.StatussModels.Check_status(status_name)

			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running 1 query"})

			}
			if len(Exist_Status) > 0 {

				c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Name already exists, please choose another Name"})

			}

			if len(Exist_Status) == 0 {

				scr := models.Status{StatusDescription: status_description, StatusName: status_name}
				fmt.Println(scr)
				if _, err := models.StatussModels.AddStatus(scr); err != nil {
					fmt.Println(err)
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					fmt.Println(err)
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Create Status Success", Data: scr})
				}
				/*
					err != nil {
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
							Msg:  "Successfull",
							Data: nil,
						}
						c.JSON(http.StatusConflict,
							response,
						)
					}*/
			}
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *StatussHandler) UpdateStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		body := c.Request.Body
		// fmt.Println(params[0])
		message, err := models.StatussModels.UpdateStatus(body, id)
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
				Msg:  message,
				Data: nil,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)

	}
}

func (u *StatussHandler) DeleteStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		
		_, err := models.StatussModels.DeleteStatusInTransition(id)
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
			_, err := models.StatussModels.DeleteStatus(id)
			if err != nil {
				loggers.Logger.Errorln(err.Error())
				response := MessageResponse{
					Msg:  err.Error(),
					Data: nil,
				}
				c.JSON(http.StatusNotFound,
					response,
				)
			}

			response := MessageResponse{
				Msg:  "Delete Successfully!",
				Data: nil,
			}
			c.JSON(http.StatusOK,
				response,
			)

		}
	}
}
