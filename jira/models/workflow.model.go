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

var WorkflowsModels = WorkflowsModel{}

// var WorkflowModels = Workflow{}

type Workflow struct {
	WorkflowName        string `json:"WorkflowName"`
	WorkflowDescription string `json:"WorkflowDescription"`
	WorkflowId          int    `json:"WorkflowId"`
}

type WorkflowsModel struct {
	Workflows []Workflow
}

//Lấy thông tin tất cả Workflow có trong db


func (wm *WorkflowsModel) GetAllWorkflow() ([]Workflow, error) {
	var ListWorkflows []Workflow
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_WORKFLOW")
	// a := byte([]`{}`)

	if err == nil {

		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			workflow := Workflow{}
			rows.Scan(&workflow.WorkflowName, &workflow.WorkflowDescription, &workflow.WorkflowId)
			ListWorkflows = append(ListWorkflows, workflow)
		}
		return ListWorkflows, nil
	} else {
		return nil, err
	}
}

// Lấy 1 Workflow dựa vào Key
func (wm *WorkflowsModel) GetById(id string) ([]Workflow, error) {
	query := fmt.Sprintf("select ID_WORKFLOW, NAME_WORKFLOW, WORKFLOW_DESCRIPTION from NEW_JIRA_WORKFLOW where ID_WORKFLOW = '%v'", id)
	// fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	// a := byte([]`{}`)

	if err == nil {
		var ListWorkflows []Workflow
		// fmt.Println(rows.Next())
		for rows.Next() {
			// fmt.Println(err.Error())
			workflow := Workflow{}
			rows.Scan(&workflow.WorkflowId, &workflow.WorkflowName, &workflow.WorkflowDescription)
			ListWorkflows = append(ListWorkflows, workflow)
		}
		return ListWorkflows, nil
	} else {
		return nil, err
	}
}

// Tạo Workflow

func (wm *WorkflowsModel) InsertWorkflow(workflow Workflow) (sql.Result, error) {
	smt := `INSERT INTO "NEW_JIRA_WORKFLOW"("NAME_WORKFLOW", "WORKFLOW_DESCRIPTION") VALUES (:1, :2)`

	return DbOracle.Db.Exec(smt, workflow.WorkflowName, workflow.WorkflowDescription)

}

// Chỉnh sửa Workflow
func (wm *WorkflowsModel) UpdateWorkflow(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	// fmt.Println(myMap)
	query := UpdateQueryWorkflow(myMap, id)
	// query := fmt.Sprintf("UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', PROJECT_AVATAR = '%v', PROJECT_DESCRIPTION = '%v', ID_WORKFLOW = '%v'  WHERE PROJECT_KEY = '%v'", workflow.Workflow_Name, workflow.Workflow_Lead, workflow.Workflow_Url, workflow.Workflow_Avatar, workflow.Workflow_Description, workflow.Workflow_, id)

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

// Xóa workflow
func (wm *WorkflowsModel) DeleteWorkflow(id string) (sql.Result, error) {
	fmt.Println(id)
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_WORKFLOW WHERE ID_WORKFLOW = '%v'", id)
	return DbOracle.Db.Exec(query)
}


func UpdateQueryWorkflow(workflow map[string]interface{}, id string) string {
	// "UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = '%v', PROJECT_AVATAR = '%v' WHERE PROJECT_ID = '%v'", workflow.Workflow_Name, workflow.Workflow_Lead, workflow.Workflow_Url, workflow.Default_Assignee, workflow.Workflow_Description, workflow.Workflow_Avatar, id)""
	// "workflow.Workflow_Name, workflow.Workflow_Lead, workflow.Workflow_Url, workflow.Default_Assignee, workflow.Workflow_Description, workflow.Workflow_Avatar"
	var WorkflowNameVal, WorkflowDescriptionVal string
	// a := workflow["Workflow_Name"]
	// fmt.Println(a)
	if workflow["WorkflowName"] != nil {
		WorkflowNameVal = fmt.Sprintf("'%v'", workflow["WorkflowName"])
	} else {
		WorkflowNameVal = "NAME_WORKFLOW"
	}

	if workflow["WorkflowDescription"] != nil {
		WorkflowDescriptionVal = fmt.Sprintf("'%v'", workflow["WorkflowDescription"])
	} else {
		WorkflowDescriptionVal = "WORKFLOW_DESCRIPTION"
	}

	query := fmt.Sprintf("UPDATE NEW_JIRA_WORKFLOW SET NAME_WORKFLOW = %v, WORKFLOW_DESCRIPTION = %v WHERE ID_WORKFLOW = '%v'", WorkflowNameVal, WorkflowDescriptionVal, id)
	return query
}

// Kiểm tra Workflow có tồn tại trong DB chưa
/*
func (pm *WorkflowsModel) Check_Workflow_Exist(key string) ([]Workflow, error){
	var temp_exist []Workflow
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_PROJECT WHERE PROJECT_KEY = '%v'", key)

	rows, err := DbOracle.Db.Query(query)

	if err == nil{
		for rows.Next() {
			workflow_ := Workflow{}

			rows.Scan(&workflow_.WorkflowKey, &workflow_.WorkflowName, &workflow_.WorkflowLead, &workflow_.WorkflowUrl, &workflow_.WorkflowAvatar, &workflow_.WorkflowDescription, &workflow_.WorkflowId)

			temp_exist = append(temp_exist, workflow_)
		}
		return temp_exist, nil
	}else{
		return nil, err
	}
}
*/
func (wm *WorkflowsModel) Check_workflow(n string) ([]Workflow, error) {
	var temp_workflow []Workflow
	query := fmt.Sprintf("SELECT * FROM \"NEW_JIRA_WORKFLOW\" WHERE  \"NAME_WORKFLOW\" = '%v'", n)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			workflow := Workflow{}

			rows.Scan(&workflow.WorkflowName, &workflow.WorkflowDescription, &workflow.WorkflowId)

			temp_workflow = append(temp_workflow, workflow)
		}
		return temp_workflow, nil
	} else {
		return nil, err
	}
}
