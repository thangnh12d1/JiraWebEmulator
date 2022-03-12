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

var TransitionsModels = TransitionsModel{}

// var ProjectModels = Project{}

type Transition struct {
	TransitionName string `json:"TransitionName"`
	Status1Id      int    `json:"Status1Id"`

	TransitionId int    `json:"TransitionId"`
	WorkflowId   int    `json:"WorkflowId"`
	Status1Name  string `json:"Status1Name"`
	Status2Id    int    `json:"Status2Id"`
	Status2Name  string `json:"Status2Name"`
}

type TransitionsModel struct {
	Transitions []Transition
}

func (sm *TransitionsModel) GetAllTransition() ([]Transition, error) {

	var listtransition []Transition

	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_TRANSITION")
	// a := byte([]`{}`)
	fmt.Println(rows)
	if err == nil {

		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			transition := Transition{}

			rows.Scan(&transition.TransitionName, &transition.Status1Id, &transition.TransitionId, &transition.WorkflowId, &transition.Status1Name, &transition.Status2Id, &transition.Status2Name)
			fmt.Println(rows)
			listtransition = append(listtransition, transition)
		}
		fmt.Println(listtransition)
		return listtransition, nil
	} else {
		fmt.Println(err)
		return nil, err
	}
}

// Lấy 1 Project dựa vào Key
func (sm *TransitionsModel) GetByIdWorkflow(id string) ([]Transition, error) {
	query := fmt.Sprintf("select NAME_TRANSITION, ID_STATUS1, ID_TRANSITION, ID_WORKFLOW, NAME_STATUS1, ID_STATUS2, NAME_STATUS2 from NEW_JIRA_TRANSITION where ID_WORKFLOW = '%v'", id)
	// fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	// a := byte([]`{}`)

	if err == nil {
		var ListTransitions []Transition
		// fmt.Println(rows.Next())
		for rows.Next() {
			// fmt.Println(err.Error())
			transition := Transition{}
			rows.Scan(&transition.TransitionName, &transition.Status1Id, &transition.TransitionId, &transition.WorkflowId, &transition.Status1Name, &transition.Status2Id, &transition.Status2Name)
			ListTransitions = append(ListTransitions, transition)
		}
		fmt.Println(ListTransitions)
		return ListTransitions, nil
	} else {
		return nil, err
	}
}

// Tạo Project

func (sm *TransitionsModel) InsertTransition(transition Transition) (sql.Result, error) {
	smt := `INSERT INTO "NEW_JIRA_TRANSITION"("NAME_TRANSITION", "ID_STATUS1", "ID_WORKFLOW", "NAME_STATUS1", "ID_STATUS2", "NAME_STATUS2") VALUES (:1, :2, :3, :4, :5, :6)`

	return DbOracle.Db.Exec(smt, transition.TransitionName, transition.Status1Id, transition.WorkflowId, transition.Status1Name, transition.Status2Id, transition.Status2Name)

}

// Chỉnh sửa Project
func (sm *TransitionsModel) UpdateTransition(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	// fmt.Println(myMap)
	query := UpdateQueryTransition(myMap, id)
	// query := fmt.Sprintf("UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', PROJECT_AVATAR = '%v', PROJECT_DESCRIPTION = '%v', ID_WORKFLOW = '%v'  WHERE PROJECT_KEY = '%v'", project.Project_Name, project.Project_Lead, project.Project_Url, project.Project_Avatar, project.Project_Description, project.Transition_, id)

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

// Xóa project
func (sm *TransitionsModel) DeleteTransition(id string) ([]Transition, error) {
	var transition Transition
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_TRANSITION WHERE ID_TRANSITION = '%v'", id)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {
		var transitions []Transition
		transitions = append(transitions, transition)

		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return transitions, nil
	} else {
		return nil, err
	}
}

func UpdateQueryTransition(transition map[string]interface{}, id string) string {
	// "UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = '%v', PROJECT_AVATAR = '%v' WHERE PROJECT_ID = '%v'", project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar, id)""
	// "project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar"
	var TransitionNameVal, Status1IdVal, WorkflowIdVal, Status1NameVal, Status2IdVal, Status2NameVal string
	// a := project["Project_Name"]
	// fmt.Println(a)
	if transition["TransitionName"] != nil {
		TransitionNameVal = fmt.Sprintf("'%v'", transition["TransitionName"])
	} else {
		TransitionNameVal = "NAME_TRANSITION"
	}

	if transition["Status1Id"] != nil {
		Status1IdVal = fmt.Sprintf("'%v'", transition["Status1Id"])
	} else {
		Status1IdVal = "ID_STATUS1"
	}

	if transition["Status2Id"] != nil {
		Status2IdVal = fmt.Sprintf("'%v'", transition["Status2Id"])
	} else {
		Status2IdVal = "ID_STATUS2"
	}
	if transition["WorkflowId"] != nil {
		WorkflowIdVal = fmt.Sprintf("'%v'", transition["WorkflowId"])
	} else {
		WorkflowIdVal = "ID_WORKFLOW"
	}
	if transition["Status1Name"] != nil {
		Status1NameVal = fmt.Sprintf("'%v'", transition["Status1Name"])
	} else {
		Status1NameVal = "NAME_STATUS1"
	}
	if transition["Status2Name"] != nil {
		Status2NameVal = fmt.Sprintf("'%v'", transition["Status2Name"])
	} else {
		Status2NameVal = "NAME_STATUS2"
	}

	query := fmt.Sprintf("UPDATE NEW_JIRA_TRANSITION SET NAME_TRANSITION = %v, ID_STATUS1 = %v, ID_WORKFLOW = %v, NAME_STATUS1 = %v, ID_STATUS2 = %v, NAME_STATUS2 =%v WHERE ID_TRANSITION = '%v'", TransitionNameVal, Status1IdVal, WorkflowIdVal, Status1NameVal, Status2IdVal, Status2NameVal, id)
	return query
}

// Kiểm tra Project có tồn tại trong DB chưa
/*
func (pm *ProjectsModel) Check_Project_Exist(key string) ([]Project, error){
	var temp_exist []Project
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_PROJECT WHERE PROJECT_KEY = '%v'", key)

	rows, err := DbOracle.Db.Query(query)

	if err == nil{
		for rows.Next() {
			project_ := Project{}

			rows.Scan(&project_.ProjectKey, &project_.ProjectName, &project_.ProjectLead, &project_.ProjectUrl, &project_.ProjectAvatar, &project_.ProjectDescription, &project_.TransitionId)

			temp_exist = append(temp_exist, project_)
		}
		return temp_exist, nil
	}else{
		return nil, err
	}
}
*/
func (sm *TransitionsModel) Check_Exist(idstatus1 string, idstatus2 string, idworkflow string) ([]Transition, error) {
	var temp_transitions []Transition
	//query
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_TRANSITION WHERE ID_STATUS1 ='%v' AND ID_STATUS2 ='%v' AND ID_WORKFLOW = '%v' ", idstatus1, idstatus2, idworkflow)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			transition := Transition{}
			rows.Scan(
				&transition.TransitionName, &transition.Status1Id, &transition.TransitionId, &transition.WorkflowId, &transition.Status1Name, &transition.Status2Id, &transition.Status2Name)
			temp_transitions = append(temp_transitions, transition)
		}
		return temp_transitions, nil
	} else {
		return nil, err
	}
}
