package handlers

import (
	// "encoding/json"
	// "fmt"
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var TransitionStatusHandlers = TransitionStatusHandler{}

type TransitionStatusHandler struct {
}

//get all Transition's status
func (pr *TransitionStatusHandler) GetAllTransitionStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		fmt.Println(id)
		Transition, err := models.TransitionStatusModels.GetAllTranSta(id)
		fmt.Println(Transition)
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: Transition})
		} else {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}
func (pr *TransitionStatusHandler) AddStatusToTransition() gin.HandlerFunc {
	return func(c *gin.Context) {
		var idTransition, idStatus string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		idTransition = fmt.Sprintf("%v", myMap["idtransition"])
		idStatus = fmt.Sprintf("%v", myMap["idstatus"])
		fmt.Println(idTransition)
		fmt.Println(idStatus)
		if idTransition == " " || idStatus == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			exists_TransitionStatus, err := models.TransitionStatusModels.Check_Exist(idTransition, idStatus)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			if len(exists_TransitionStatus) > 0 {
				c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Status already exists, please choose another Status "})
			}
			if len(exists_TransitionStatus) == 0 {
				sm := models.TransitionStatusModel{}
				if _, err := sm.AddStatusToTransition(idTransition, idStatus); err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success"})

				}
			}
		}
	}
}
func (pr *TransitionStatusHandler) UpdateTransitionStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		var idStatusnew string
		idTransition := c.Query("idtransition")
		idStatus := c.Query("idrow")
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		idStatusnew = fmt.Sprintf("%v", myMap["idstatus"])
		if idStatusnew == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "id are not enough"})

		} else {
			if _, err := models.TransitionStatusModels.UpdateTransitionStatus(idStatus, idTransition, idStatusnew); err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update Transition success"})
			}
		}
	}
}

//func delete Status Transition
func (pr *TransitionStatusHandler) DeleteTransitionStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		idtransition := c.Query("idtransition")

		idstatus := c.Query("idrow")
		fmt.Println(idtransition)
		fmt.Println(idstatus)
		if idtransition == " " || idstatus == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "idTransition and idStatus not enough"})
		} else {
			exists_TransitionStatus, err := models.TransitionStatusModels.Check_Exist(idtransition, idstatus)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				fmt.Println(exists_TransitionStatus)
				if len(exists_TransitionStatus) == 0 {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Does not exist"})
				} else if len(exists_TransitionStatus) > 0 {
					if _, err := models.TransitionStatusModels.DeleteTransitionStatus(idtransition, idstatus); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
					}
				}
			}
		}
	}
}
