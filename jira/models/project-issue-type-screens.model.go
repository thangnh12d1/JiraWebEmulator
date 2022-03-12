package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	. "jira/common/db"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var ProjectIssueTypeScreensModels = ProjectIssueTypeScreensModel{}

// var ProjectIssueTypeScreenModels = ProjectIssueTypeScreen{}

type ProjectIssueTypeScreen struct {
	Project    string
	Issue_Type int
	Screen     int
	Id         int
}

type ProjectIssueTypeScreensModel struct {
	ProjectIssueTypeScreens []ProjectIssueTypeScreen
}

func (pm *ProjectIssueTypeScreensModel) Get() ([]ProjectIssueTypeScreen, error) {
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN")
	if err == nil {
		var ListProjectIssueTypeScreens []ProjectIssueTypeScreen
		for rows.Next() {
			projectIssueTypeScreen := ProjectIssueTypeScreen{}
			rows.Scan(&projectIssueTypeScreen.Project, &projectIssueTypeScreen.Issue_Type, &projectIssueTypeScreen.Screen, &projectIssueTypeScreen.Id)
			ListProjectIssueTypeScreens = append(ListProjectIssueTypeScreens, projectIssueTypeScreen)
		}
		return ListProjectIssueTypeScreens, nil
	} else {
		return nil, err
	}
}

func (pm *ProjectIssueTypeScreensModel) GetById(id string) ([]ProjectIssueTypeScreen, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN where ID = '%v'", id)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListProjectIssueTypeScreens []ProjectIssueTypeScreen
		for rows.Next() {
			projectIssueTypeScreen := ProjectIssueTypeScreen{}
			rows.Scan(&projectIssueTypeScreen.Project, &projectIssueTypeScreen.Issue_Type, &projectIssueTypeScreen.Screen, &projectIssueTypeScreen.Id)
			ListProjectIssueTypeScreens = append(ListProjectIssueTypeScreens, projectIssueTypeScreen)
		}
		return ListProjectIssueTypeScreens, nil
	} else {
		return nil, err
	}
}

func (pm *ProjectIssueTypeScreensModel) Create(r io.ReadCloser) ([]ProjectIssueTypeScreen, error) {
	var projectIssueTypeScreen ProjectIssueTypeScreen
	json.NewDecoder(r).Decode(&projectIssueTypeScreen)
	query := fmt.Sprintf(
		`INSERT INTO NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN (PROJECT,ISSUE_TYPE,SCREEN,ID)
		VALUES ('%v', '%v', '%v',SEQ_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN.nextval)`,
		projectIssueTypeScreen.Project, projectIssueTypeScreen.Issue_Type, projectIssueTypeScreen.Screen)
	_, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListProjectIssueTypeScreens []ProjectIssueTypeScreen
			for rowsLastRecord.Next() {
				projectIssueTypeScreen := ProjectIssueTypeScreen{}
				rowsLastRecord.Scan(&projectIssueTypeScreen.Project, &projectIssueTypeScreen.Issue_Type, &projectIssueTypeScreen.Screen, &projectIssueTypeScreen.Id)
				ListProjectIssueTypeScreens = append(ListProjectIssueTypeScreens, projectIssueTypeScreen)
			}
			return ListProjectIssueTypeScreens, nil
		} else {
			return nil, err
		}
	} else {
		return nil, err
	}
}

func (pm *ProjectIssueTypeScreensModel) Delete(id string) ([]ProjectIssueTypeScreen, error) {
	projectIssueTypeScreens, err := ProjectIssueTypeScreensModels.GetById(id)
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN WHERE ID = %v", id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return projectIssueTypeScreens, nil
	} else {
		return nil, err
	}
}
