package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	//"github.com/godror/godror/odpi/src"
	_ "github.com/godror/godror"
)

var TransitionsHandlers = TransitionsHandler{}

type TransitionsHandler struct {
}

func (u *TransitionsHandler) GetAllTransition() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		transitions, err := models.TransitionsModels.GetAllTransition()
		fmt.Println(transitions)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: transitions,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: transitions,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}
func (u *TransitionsHandler) GetByIdWorkflow() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Query("id")
		transitions, err := models.TransitionsModels.GetByIdWorkflow(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: transitions,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: transitions,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

// TAO Transition
func (u *TransitionsHandler) CreateTransition() gin.HandlerFunc {
	return func(c *gin.Context) {
		var transition_name, status1_id, workflow_id, status1_name, status2_id, status2_name string

		var myMapNew map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMapNew)
		workflow_id = fmt.Sprintf("%v", myMapNew["WorkflowId"])
		transition_name = fmt.Sprintf("%v", myMapNew["TransitionName"])
		status1_id = fmt.Sprintf("%v", myMapNew["Status1Id"])

		status1_name = fmt.Sprintf("%v", myMapNew["Status1Name"])
		status2_id = fmt.Sprintf("%v", myMapNew["Status2Id"])

		status2_name = fmt.Sprintf("%v", myMapNew["Status2Name"])

		st1_id, _ := strconv.Atoi(status1_id)
		st2_id, _ := strconv.Atoi(status2_id)
		wk_id, _ := strconv.Atoi(workflow_id)

		// Parameters are null
		if transition_name == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_transition, err := models.TransitionsModels.Check_Exist(status1_id, status2_id, workflow_id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running 1 query"})
			}
			if len(Exist_transition) > 0 {
				if Exist_transition[0].Status1Id == st1_id && Exist_transition[0].Status2Id == st2_id {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Transition already exists, please choose another Transition"})
				}
			}
			if len(Exist_transition) == 0 {
				scr := models.Transition{TransitionName: transition_name, Status1Id: st1_id, WorkflowId: wk_id, Status1Name: status1_name, Status2Id: st2_id, Status2Name: status2_name}

				fmt.Println(scr)
				if _, err := models.TransitionsModels.InsertTransition(scr); err != nil {
					fmt.Println(err)
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					fmt.Println(err)
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Create Transition Success", Data: scr})
				}
			}
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}
func (u *TransitionsHandler) UpdateTransition() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		body := c.Request.Body
		// fmt.Println(params[0])
		message, err := models.TransitionsModels.UpdateTransition(body, id)
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
func (u *TransitionsHandler) DeleteTransition() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		_, err := models.TransitionsModels.DeleteTransition(id)
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
				Data: nil,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
