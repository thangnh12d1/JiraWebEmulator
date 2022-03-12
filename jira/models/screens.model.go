package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	. "jira/common/db"

	_ "github.com/godror/godror"
)

var ScreensModels = ScreensModel{}

type Screen struct {
	Id          int
	Name        string
	Description string
}

type ScreensModel struct {
	Screens []Screen
}

func (pm *ScreensModel) Get() ([]Screen, error) {
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_SCREEN")
	if err == nil {
		var ListScreens []Screen
		for rows.Next() {
			screen := Screen{}
			rows.Scan(&screen.Id, &screen.Name, &screen.Description)
			ListScreens = append(ListScreens, screen)
		}
		return ListScreens, nil
	} else {
		return nil, err
	}
}

func (pm *ScreensModel) GetById(id string) ([]Screen, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_SCREEN where ID = '%v'", id)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListScreens []Screen
		for rows.Next() {
			screen := Screen{}
			rows.Scan(&screen.Id, &screen.Name, &screen.Description)
			ListScreens = append(ListScreens, screen)
		}
		return ListScreens, nil
	} else {
		return nil, err
	}
}

func (pm *ScreensModel) Create(r io.ReadCloser) ([]Screen, error) {
	var screen Screen
	json.NewDecoder(r).Decode(&screen)
	query := fmt.Sprintf(
		`INSERT INTO NEW_JIRA_SCREEN (ID,NAME,DESCRIPTION) 
		VALUES (SEQ_NEW_JIRA_SCREEN.nextval, '%v', '%v')`,
		screen.Name, screen.Description)
	_, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_SCREEN ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListScreens []Screen
			for rowsLastRecord.Next() {
				screen := Screen{}
				rowsLastRecord.Scan(&screen.Id, &screen.Name, &screen.Description)
				ListScreens = append(ListScreens, screen)
			}
			return ListScreens, nil
		} else {
			return nil, err
		}
	} else {
		return nil, err
	}
}

func (pm *ScreensModel) Update(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	query := UpdateQueryScreen(myMap, id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return "", errors.New("no row affect")
		}
		return "Update successfully", nil
	} else {
		return "", err
	}
}

func UpdateQueryScreen(screen map[string]interface{}, id string) string {
	var Name, Description string
	if screen["Name"] != nil {
		Name = fmt.Sprintf("'%v'", screen["Name"])
	} else {
		Name = ""
	}
	if screen["Description"] != nil {
		Description = fmt.Sprintf("'%v'", screen["Description"])
	} else {
		Description = ""
	}
	query := fmt.Sprintf(
		"UPDATE NEW_JIRA_SCREEN SET NAME = %v, DESCRIPTION = %v WHERE ID = %v",
		Name, Description, id)
	//fmt.Println(query)
	return query
}

func (pm *ScreensModel) Update2(r io.ReadCloser, id string) ([]Screen, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	query := UpdateQueryScreen(myMap, id)
	row, err := DbOracle.Db.Exec(query)
	fmt.Println(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		query := fmt.Sprintf("select * from NEW_JIRA_SCREEN where ID = '%v'", id)
		rowsUpdatedtRecord, errUpdatedtRecord :=
			DbOracle.Db.Query(query)
		if errUpdatedtRecord == nil {
			var ListScreens []Screen
			for rowsUpdatedtRecord.Next() {
				screen := Screen{}
				rowsUpdatedtRecord.Scan(&screen.Id, &screen.Name, &screen.Description)
				ListScreens = append(ListScreens, screen)
			}
			return ListScreens, nil
		} else {
			return nil, err
		}

	} else {
		return nil, err
	}
}

func (pm *ScreensModel) Delete(id string) ([]Screen, error) {
	screens, err := ScreensModels.GetById(id)
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_SCREEN WHERE ID = %v", id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return screens, nil
	} else {
		return nil, err
	}
}
