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

var IssueTypesModels = IssueTypesModel{}

// var IssueTypeModels = IssueType{}

type IssueType struct {
	Id          int
	Name        string
	Icon        string
	Description string
}

type IssueTypesModel struct {
	IssueTypes []IssueType
}

func (pm *IssueTypesModel) Get() ([]IssueType, error) {
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_ISSUE_TYPE")
	if err == nil {
		var ListIssueTypes []IssueType
		for rows.Next() {
			issueType := IssueType{}
			rows.Scan(&issueType.Id, &issueType.Name, &issueType.Icon, &issueType.Description)
			ListIssueTypes = append(ListIssueTypes, issueType)
		}
		return ListIssueTypes, nil
	} else {
		return nil, err
	}
}

func (pm *IssueTypesModel) GetById(id string) ([]IssueType, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_ISSUE_TYPE where ID = '%v'", id)
	fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListIssueTypes []IssueType
		for rows.Next() {
			issueType := IssueType{}
			rows.Scan(&issueType.Id, &issueType.Name, &issueType.Icon, &issueType.Description)
			ListIssueTypes = append(ListIssueTypes, issueType)
		}
		return ListIssueTypes, nil
	} else {
		return nil, err
	}
}

func (pm *IssueTypesModel) Create(r io.ReadCloser) ([]IssueType, error) {
	var issueType IssueType
	json.NewDecoder(r).Decode(&issueType)
	query := fmt.Sprintf(
		`INSERT INTO NEW_JIRA_ISSUE_TYPE (ID,NAME,ICON,DESCRIPTION) 
		VALUES (SEQ_NEW_JIRA_ISSUE_TYPE.nextval, '%v', '%v', '%v')`,
		issueType.Name, issueType.Icon, issueType.Description)
	_, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_ISSUE_TYPE ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListIssueTypes []IssueType
			for rowsLastRecord.Next() {
				issueType := IssueType{}
				rowsLastRecord.Scan(&issueType.Id, &issueType.Name, &issueType.Icon, &issueType.Description)
				ListIssueTypes = append(ListIssueTypes, issueType)
			}
			return ListIssueTypes, nil
		} else {
			return nil, err
		}
	} else {
		return nil, err
	}
}

func UpdateQueryIssueType(issueType map[string]interface{}, id string) string {

	var Name, Icon, Description string
	if issueType["Name"] != nil {
		Name = fmt.Sprintf("'%v'", issueType["Name"])
	} else {
		Name = ""
	}
	if issueType["Icon"] != nil {
		Icon = fmt.Sprintf("'%v'", issueType["Icon"])
	} else {
		Icon = ""
	}
	if issueType["Description"] != nil {
		Description = fmt.Sprintf("'%v'", issueType["Description"])
	} else {
		Description = ""
	}
	query := fmt.Sprintf("UPDATE NEW_JIRA_ISSUE_TYPE SET NAME = %v, ICON = %v, DESCRIPTION = %v WHERE ID = %v",
		Name, Icon, Description, id)
	//fmt.Println(query)
	return query
}

func (pm *IssueTypesModel) Update(r io.ReadCloser, id string) ([]IssueType, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	query := UpdateQueryIssueType(myMap, id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		query := fmt.Sprintf("select * from NEW_JIRA_ISSUE_TYPE where ID = '%v'", id)
		rowsUpdatedtRecord, errUpdatedtRecord :=
			DbOracle.Db.Query(query)
		if errUpdatedtRecord == nil {
			var ListIssueTypes []IssueType
			for rowsUpdatedtRecord.Next() {
				issueType := IssueType{}
				rowsUpdatedtRecord.Scan(&issueType.Id, &issueType.Name, &issueType.Icon, &issueType.Description)
				ListIssueTypes = append(ListIssueTypes, issueType)
			}
			return ListIssueTypes, nil
		} else {
			return nil, err
		}

	} else {
		return nil, err
	}
}

func (pm *IssueTypesModel) Delete(id string) ([]IssueType, error) {
	issueTypes, err := IssueTypesModels.GetById(id)
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_ISSUE_TYPE WHERE ID = %v", id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return issueTypes, nil
	} else {
		return nil, err
	}
}
