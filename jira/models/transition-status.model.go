package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"

	_ "github.com/godror/godror"
)

var TransitionStatusModels = TransitionStatusModel{}

type TransitionStatus struct {
	TransitionId   int    `json:"TransitionId"`
	TransitionName string `json:"TransitionName"`
	StatusId       int    `json:"StatusId`
	StatusName     string `json:"StatusName"`
}

type TransitionStatusModel struct {
	TransitionStatuss []Transition
}

///
func (pr *TransitionStatusModel) GetAllTranSta(id string) ([]TransitionStatus, error) {
	var temp_transitionstatus []TransitionStatus
	//sql
	query := fmt.Sprintf("SELECT NEW_JIRA_TRANSITION_STATUS.ID_TRANSITION,NEW_JIRA_TRANSITION_STATUS.ID_STATUS2,NEW_JIRA_TRANSITION.NAME_TRANSITION,NEW_JIRA_STATUS.NAME_STATUS FROM NEW_JIRA_TRANSITION, NEW_JIRA_TRANSITION_STATUS, NEW_JIRA_STATUS WHERE NEW_JIRA_TRANSITION.ID_TRANSITION=NEW_JIRA_TRANSITION_STATUS.ID_TRANSITION AND NEW_JIRA_TRANSITION_STATUS.ID_STATUS2 = NEW_JIRA_STATUS.ID_STATUS AND NEW_JIRA_TRANSITION_STATUS.ID_TRANSITION = '%v'", id)

	rows, err := DbOracle.Db.Query(query)
	fmt.Println(rows)
	if err == nil {
		for rows.Next() {
			transitionstatus := TransitionStatus{}
			rows.Scan(
				&transitionstatus.TransitionId,
				&transitionstatus.StatusId,
				&transitionstatus.TransitionName,
				&transitionstatus.StatusName,
			)
			temp_transitionstatus = append(temp_transitionstatus, transitionstatus)

		}
		return temp_transitionstatus, nil
	} else {
		return nil, err
	}

}
func (pr *TransitionStatusModel) UpdateTransitionStatus(idstatus string, idtransition string, idStatusnew string) (sql.Result, error) {
	var Query_temp string
	if idStatusnew != "" {
		Query_temp = fmt.Sprintf("ID_TRANSITION= '%v'", idStatusnew)
	} else {
		Query_temp = "ID_TRANSITION=ID_TRANSITION"
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_TRANSITION_STATUS" SET %v  WHERE "ID_TRANSITION"=:1 AND "ID_STATUS2"=:2`, Query_temp)
	return DbOracle.Db.Exec(smt, idtransition, idstatus)

}

//Add transition and status to db
func (pr *TransitionStatusModel) AddStatusToTransition(idtransition string, idstatus string) (sql.Result, error) {
	smt := `INSERT INTO "NEW_JIRA_TRANSITION_STATUS"("ID_TRANSITION","ID_STATUS2") VALUES (:1,:2)`
	return DbOracle.Db.Exec(smt, idtransition, idstatus)
}

//check transitionstatus already
func (pr *TransitionStatusModel) Check_Exist(idtransition string, idstatus string) ([]TransitionStatus, error) {
	var temp_transitionstatus []TransitionStatus
	//query
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_TRANSITION_STATUS WHERE ID_TRANSITION ='%v' AND ID_STATUS2 ='%v' ", idtransition, idstatus)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			transitionstatus := TransitionStatus{}
			rows.Scan(
				&transitionstatus.TransitionId,
				&transitionstatus.StatusId,
			)
			temp_transitionstatus = append(temp_transitionstatus, transitionstatus)
		}
		return temp_transitionstatus, nil
	} else {
		return nil, err
	}
}

//Delete transitionstatus
func (pr *TransitionStatusModel) DeleteTransitionStatus(idtransition string, idstatus string) (sql.Result, error) {
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_TRANSITION_STATUS WHERE ID_TRANSITION ='%v' AND ID_STATUS2 ='%v' ", idtransition, idstatus)
	return DbOracle.Db.Exec(query)
}
