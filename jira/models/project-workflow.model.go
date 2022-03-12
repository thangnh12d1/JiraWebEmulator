package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"

	_ "github.com/godror/godror"
)

var WorkflowProjectModels = WorkflowProjectModel{}

type WorkflowProject struct {
	WorkflowId   int    `json:"WorkflowId"`
	ProjectKey   string `json:"ProjectKey"`
	WorkflowName string `json:"WorkflowName"`
	ProjectName  string `json:"ProjectName"`
}

type WorkflowProjectModel struct {
	WorkflowProjects []Workflow
}

///
func (pr *WorkflowProjectModel) GetAllWorPro(id string) ([]WorkflowProject, error) {
	var temp_workflowproject []WorkflowProject
	//sql
	query := fmt.Sprintf("SELECT NEW_JIRA_WORKFLOWPROJECT.ID_WORKFLOW,NEW_JIRA_WORKFLOWPROJECT.PROJECT_KEY,NEW_JIRA_WORKFLOW.NAME_WORKFLOW,NEW_JIRA_PROJECT.PROJECT_NAME FROM NEW_JIRA_WORKFLOW, NEW_JIRA_WORKFLOWPROJECT,NEW_JIRA_PROJECT WHERE NEW_JIRA_WORKFLOW.ID_WORKFLOW=NEW_JIRA_WORKFLOWPROJECT.ID_WORKFLOW  AND NEW_JIRA_WORKFLOWPROJECT.PROJECT_KEY = NEW_JIRA_PROJECT.PROJECT_KEY AND NEW_JIRA_WORKFLOWPROJECT.ID_WORKFLOW = '%v'", id)

	rows, err := DbOracle.Db.Query(query)
	fmt.Println(rows)
	if err == nil {
		for rows.Next() {
			workflowproject := WorkflowProject{}
			rows.Scan(
				&workflowproject.WorkflowId,
				&workflowproject.ProjectKey,
				&workflowproject.WorkflowName,
				&workflowproject.ProjectName,
			)
			temp_workflowproject = append(temp_workflowproject, workflowproject)

		}
		return temp_workflowproject, nil
	} else {
		return nil, err
	}

}
func (pr *WorkflowProjectModel) UpdateWorkflowProject(idproject string, idworkflow string) (sql.Result, error) {
	fmt.Println(idproject)
	fmt.Println(idworkflow)
	var Query_temp string
	if idworkflow != "" {
		Query_temp = fmt.Sprintf("ID_WORKFLOW= '%v'", idworkflow)
	} else {
		Query_temp = "ID_WORKFLOW = ID_WORKFLOW"
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_PROJECT" SET %v  WHERE "PROJECT_KEY"=:1`, Query_temp)
	return DbOracle.Db.Exec(smt, idproject)

}

//Add workflow and project to db
func (pr *WorkflowProjectModel) AddProjectToWorkflow(idworkflow string, idproject string) (sql.Result, error) {
	fmt.Println(idworkflow)
	fmt.Println(idproject)
	smt := `INSERT INTO "NEW_JIRA_WORKFLOWPROJECT"("ID_WORKFLOW","PROJECT_KEY") VALUES (:1,:2)`
	return DbOracle.Db.Exec(smt, idworkflow, idproject)
}

//check workflowproject already
func (pr *WorkflowProjectModel) Check_Exist(idworkflow string, idproject string) ([]WorkflowProject, error) {
	var temp_workflowproject []WorkflowProject
	//query
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_WORKFLOWPROJECT WHERE PROJECT_KEY ='%v' ", idproject)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			workflowproject := WorkflowProject{}
			rows.Scan(
				&workflowproject.WorkflowId,
				&workflowproject.ProjectKey,
			)
			temp_workflowproject = append(temp_workflowproject, workflowproject)
		}
		return temp_workflowproject, nil
	} else {
		return nil, err
	}
}

//Delete workflowproject
func (pr *WorkflowProjectModel) DeleteWorkflowProject(idworkflow string, idproject string) (sql.Result, error) {
	fmt.Println(idworkflow)
	query := fmt.Sprintf("UPDATE NEW_JIRA_WORKFLOWPROJECT SET ID_WORKFLOW = '0' WHERE ID_WORKFLOW ='%v' AND PROJECT_KEY ='%v' ", idworkflow, idproject)
	return DbOracle.Db.Exec(query)
}

func (pr *WorkflowProjectModel) DeleteIdWorkflowInWorkflowProject(idworkflow string, idproject string) (sql.Result, error) {
	fmt.Println(idworkflow)
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_WORKFLOWPROJECT WHERE ID_WORKFLOW = '0' AND PROJECT_KEY ='%v' ", idproject)
	return DbOracle.Db.Exec(query)
}
