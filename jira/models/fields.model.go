package models

import (
	"fmt"
	. "jira/common/db"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var FieldsModels = FieldsModel{}

// var FieldModels = Field{}

type Field struct {
	Issue        string
	Name         string
	Description  string
	Value        string
	Field_Type   string
	Custom_Field int
}

type FieldsModel struct {
	Fields []Field
}

func (pm *FieldsModel) GetAllFieldsByIssueKey(key string) ([]Field, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_FIELD where ISSUE = '%v'", key)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListFields []Field
		for rows.Next() {
			field := Field{}
			rows.Scan(&field.Issue, &field.Name, &field.Description, &field.Value, &field.Field_Type)
			ListFields = append(ListFields, field)
		}
		return ListFields, nil
	} else {
		return nil, err
	}
}

func (pm *FieldsModel) Create(Fields []Field) ([]Field, error) {
	for _, field := range Fields {
		query := fmt.Sprintf(
			`INSERT INTO NEW_JIRA_FIELD (ISSUE,NAME,DESCRIPTION,VALUE,FIELD_TYPE) VALUES ('%v','%v','%v','%v','%v')`,
			field.Issue, field.Name, field.Description, field.Value, field.Field_Type)
		_, err := DbOracle.Db.Exec(query)
		if err != nil {
			return nil, err
		}
	}
	return nil, nil
}

// func UpdateQueryField(field map[string]interface{}, id string) string {

// 	var Name, Description, Description string
// 	if field["Name"] != nil {
// 		Name = fmt.Sprintf("'%v'", field["Name"])
// 	} else {
// 		Name = ""
// 	}
// 	if field["Description"] != nil {
// 		Description = fmt.Sprintf("'%v'", field["Description"])
// 	} else {
// 		Description = ""
// 	}
// 	if field["Description"] != nil {
// 		Description = fmt.Sprintf("'%v'", field["Description"])
// 	} else {
// 		Description = ""
// 	}
// 	query := fmt.Sprintf("UPDATE NEW_JIRA_FIELD SET NAME = %v, FIELD_FIELD_TYPE = %v, DESCRIPTION = %v WHERE ID = %v",
// 		Name, Description, Description, id)
// 	//fmt.Println(query)
// 	return query
// }

// func (pm *FieldsModel) Update(r io.ReadCloser, id string) ([]Field, error) {
// 	var myMap map[string]interface{}
// 	json.NewDecoder(r).Decode(&myMap)
// 	query := UpdateQueryField(myMap, id)
// 	row, err := DbOracle.Db.Exec(query)
// 	if err == nil {
// 		rowsAffect, _ := row.RowsAffected()
// 		if rowsAffect == 0 {
// 			return nil, errors.New("no row affect")
// 		}
// 		query := fmt.Sprintf("select * from NEW_JIRA_FIELD where ID = '%v'", id)
// 		rowsUpdatedtRecord, errUpdatedtRecord :=
// 			DbOracle.Db.Query(query)
// 		if errUpdatedtRecord == nil {
// 			var ListFields []Field
// 			for rowsUpdatedtRecord.Next() {
// 				field := Field{}
// 				rowsUpdatedtRecord.Scan(&field.Issue, &field.Name, &field.Description, &field.Description)
// 				ListFields = append(ListFields, field)
// 			}
// 			return ListFields, nil
// 		} else {
// 			return nil, err
// 		}

// 	} else {
// 		return nil, err
// 	}
// }

// func (pm *FieldsModel) Delete(id string) ([]Field, error) {
// 	fields, err := FieldsModels.GetByIssue(id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	query := fmt.Sprintf("DELETE FROM NEW_JIRA_FIELD WHERE ID = %v", id)
// 	row, err := DbOracle.Db.Exec(query)
// 	if err == nil {
// 		rowsAffect, _ := row.RowsAffected()
// 		if rowsAffect == 0 {
// 			return nil, errors.New("no row affect")
// 		}
// 		return fields, nil
// 	} else {
// 		return nil, err
// 	}
// }
