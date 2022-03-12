package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	. "jira/common/db"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var StatussModels = StatussModel{}

// var StatusModels = Status{}

type Status struct {

	//StatusId          int

	StatusId          int    `json:"StatusId"`
	StatusDescription string `json:"StatusDescription"`
	StatusName        string `json:"StatusName"`
}

type StatussModel struct {
	Statuss []Status
}

//Lấy thông tin tất cả Status có trong db
func (pm *StatussModel) GetAllStatus() ([]Status, error) {
	var ListStatuss []Status
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_STATUS")
	// a := byte([]`{}`)
	if err == nil {

		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			status := Status{}
			rows.Scan(&status.StatusId, &status.StatusDescription, &status.StatusName)
			ListStatuss = append(ListStatuss, status)
		}
		fmt.Println(ListStatuss)
		return ListStatuss, nil
	} else {
		return nil, err
	}
}

// Lấy 1 Status dựa vào Id

// Tạo Status
func (pm *StatussModel) AddStatus(status Status) (sql.Result, error) {
	//add Status from client to db

	smt := `INSERT INTO "NEW_JIRA_STATUS"("STATUSDESCRIPTION", "NAME_STATUS") VALUES (:1,:2)`

	return DbOracle.Db.Exec(smt, status.StatusDescription, status.StatusName)

}
func (pm *StatussModel) DeleteStatus(id string) (sql.Result, error) {
	//query delete user by id
	fmt.Println(id)
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_STATUS WHERE ID_STATUS = '%v'", id)
	return DbOracle.Db.Exec(query)
}
func (pm *StatussModel) DeleteStatusInTransition(id string) (sql.Result, error) {
	//query delete user by id
	fmt.Println(id)
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_TRANSITION WHERE ID_STATUS1 = '%v' OR ID_STATUS2 = '%v'", id, id)
	return DbOracle.Db.Exec(query)
}

func (tm *StatussModel) UpdateStatus(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	// fmt.Println(myMap)
	query := UpdateQueryStatus(myMap, id)
	// query := fmt.Sprintf("UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', PROJECT_AVATAR = '%v', PROJECT_DESCRIPTION = '%v', ID_WORKFLOW = '%v'  WHERE PROJECT_KEY = '%v'", Status.Status_Name, Status.Status_Lead, Status.Status_Url, Status.Status_Avatar, Status.Status_Description, Status.Workflow_, id)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {

		rowsAffect, _ := row.RowsAffected()
		// fmt.Println(rowsAffectErr)
		if rowsAffect == 0 {
			return "", errors.New("no row affect")
		}
		return "Update successfully", nil
	} else {
		// fmt.Println(row.RowsAffected())
		return "", err
	}

	// return "abc", nil
}

func UpdateQueryStatus(Status map[string]interface{}, id string) string {
	// "UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = '%v', PROJECT_AVATAR = '%v' WHERE PROJECT_ID = '%v'", Status.Status_Name, Status.Status_Lead, Status.Status_Url, Status.Default_Assignee, Status.Status_Description, Status.Status_Avatar, id)""
	// "Status.Status_Name, Status.Status_Lead, Status.Status_Url, Status.Default_Assignee, Status.Status_Description, Status.Status_Avatar"
	var StatusNameVal, StatusDescriptionVal string
	// a := Status["Status_Name"]
	// fmt.Println(a)
	if Status["StatusName"] != nil {
		StatusNameVal = fmt.Sprintf("'%v'", Status["StatusName"])
	} else {
		StatusNameVal = "NAME_STATUS"
	}

	if Status["StatusDescription"] != nil {
		StatusDescriptionVal = fmt.Sprintf("'%v'", Status["StatusDescription"])
	} else {
		StatusDescriptionVal = "STATUSDESCRIPTION"
	}

	// if Status["WorkflowId"] != nil {
	// 	WorkflowIdVal = fmt.Sprintf("'%v'", Status["WorkflowId"])
	// } else {
	// 	WorkflowIdVal = "ID_WORKFLOW"
	// }
	/*
		if Status["DefaultAssignee"] != nil {
			StatusDefaultAssigneeVal = fmt.Sprintf("'%v'", Status["DefaultAssignee"])
		} else {
			StatusDefaultAssigneeVal = "DEFAULT_ASSIGNEE"
		}
	*/

	query := fmt.Sprintf("UPDATE NEW_JIRA_STATUS SET NAME_STATUS = %v, STATUSDESCRIPTION = %v WHERE ID_STATUS = '%v'", StatusNameVal, StatusDescriptionVal, id)

	return query
}

func (tm *StatussModel) Check_status(name string) ([]Status, error) {
	var temp_status []Status
	query := fmt.Sprintf("SELECT * FROM \"NEW_JIRA_STATUS\" WHERE \"NAME_STATUS\" = '%v'", name)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			status := Status{}

			rows.Scan(&status.StatusDescription, &status.StatusName)

			temp_status = append(temp_status, status)
		}
		return temp_status, nil
	} else {
		return nil, err
	}
}
