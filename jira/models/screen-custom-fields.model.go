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

var ScreenCustomFieldsModels = ScreenCustomFieldsModel{}

// var ScreenCustomFieldModels = ScreenCustomField{}

type ScreenCustomField struct {
	Screen       int
	Custom_Field int
	Id           int
}

type ScreenCustomFieldsModel struct {
	ScreenCustomFields []ScreenCustomField
}

func (pm *ScreenCustomFieldsModel) Get() ([]ScreenCustomField, error) {
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_SCREEN_CUSTOM_FIELD")
	if err == nil {
		var ListScreenCustomFields []ScreenCustomField
		for rows.Next() {
			screenCustomField := ScreenCustomField{}
			rows.Scan(&screenCustomField.Screen, &screenCustomField.Custom_Field, &screenCustomField.Id)
			ListScreenCustomFields = append(ListScreenCustomFields, screenCustomField)
		}
		return ListScreenCustomFields, nil
	} else {
		return nil, err
	}
}

func (pm *ScreenCustomFieldsModel) GetById(id string) ([]ScreenCustomField, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_SCREEN_CUSTOM_FIELD where ID = '%v'", id)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListScreenCustomFields []ScreenCustomField
		for rows.Next() {
			screenCustomField := ScreenCustomField{}
			rows.Scan(&screenCustomField.Screen, &screenCustomField.Custom_Field, &screenCustomField.Id)
			ListScreenCustomFields = append(ListScreenCustomFields, screenCustomField)
		}
		return ListScreenCustomFields, nil
	} else {
		return nil, err
	}
}

func (pm *ScreenCustomFieldsModel) Create(r io.ReadCloser) ([]ScreenCustomField, error) {
	var screenCustomField ScreenCustomField
	json.NewDecoder(r).Decode(&screenCustomField)
	query := fmt.Sprintf(
		`INSERT INTO NEW_JIRA_SCREEN_CUSTOM_FIELD (SCREEN,CUSTOM_FIELD,ID) 
		VALUES ('%v', '%v',SEQ_NEW_JIRA_SCREEN_CUSTOM_FIELD.nextval)`,
		screenCustomField.Screen, screenCustomField.Custom_Field)
	_, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_SCREEN_CUSTOM_FIELD ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListScreenCustomFields []ScreenCustomField
			for rowsLastRecord.Next() {
				screenCustomField := ScreenCustomField{}
				rowsLastRecord.Scan(&screenCustomField.Screen, &screenCustomField.Custom_Field, &screenCustomField.Id)
				ListScreenCustomFields = append(ListScreenCustomFields, screenCustomField)
			}
			return ListScreenCustomFields, nil
		} else {
			return nil, err
		}
	} else {
		return nil, err
	}
}

func UpdateQueryScreenCustomField(screenCustomField map[string]interface{}, id string) string {

	var Screen, Custom_Field string
	if screenCustomField["Screen"] != nil {
		Screen = fmt.Sprintf("'%v'", screenCustomField["Screen"])
	} else {
		Screen = ""
	}
	if screenCustomField["Custom_Field"] != nil {
		Custom_Field = fmt.Sprintf("'%v'", screenCustomField["Custom_Field"])
	} else {
		Custom_Field = ""
	}
	query := fmt.Sprintf("UPDATE NEW_JIRA_SCREEN_CUSTOM_FIELD SET SCREEN = %v, CUSTOM_FIELD = %v WHERE Id = %v",
		Screen, Custom_Field, id)
	//fmt.Println(query)
	return query
}

func (pm *ScreenCustomFieldsModel) Update(r io.ReadCloser, id string) ([]ScreenCustomField, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	query := UpdateQueryScreenCustomField(myMap, id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		query := fmt.Sprintf("select * from NEW_JIRA_SCREEN_CUSTOM_FIELD where ID = '%v'", id)
		rowsUpdatedtRecord, errUpdatedtRecord :=
			DbOracle.Db.Query(query)
		if errUpdatedtRecord == nil {
			var ListScreenCustomFields []ScreenCustomField
			for rowsUpdatedtRecord.Next() {
				screenCustomField := ScreenCustomField{}
				rowsUpdatedtRecord.Scan(&screenCustomField.Screen, &screenCustomField.Custom_Field, &screenCustomField.Id)
				ListScreenCustomFields = append(ListScreenCustomFields, screenCustomField)
			}
			return ListScreenCustomFields, nil
		} else {
			return nil, err
		}

	} else {
		return nil, err
	}
}

func (pm *ScreenCustomFieldsModel) Delete(id string) ([]ScreenCustomField, error) {
	screenCustomFields, err := ScreenCustomFieldsModels.GetById(id)
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_SCREEN_CUSTOM_FIELD WHERE ID = %v", id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return screenCustomFields, nil
	} else {
		return nil, err
	}
}
