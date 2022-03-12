package models

import (
	"database/sql"
	. "jira/common/db"
)

var ScrFieldModels = ScrFieldModel{}

type ScrField struct {
	ScreenId int `json:"Screen_Id"`
	FieldId  int `json:"Field_Id"`
}

type ScrFieldModel struct{}

func (sf *ScrFieldModel) Get() ([]ScrField, error) {
	rows, err := DbOracle.Db.Query("Select * From JIRA_SCREEN_FIELD")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []ScrField{}
	for rows.Next() {
		r := ScrField{}
		rows.Scan(&r.FieldId, &r.ScreenId)
		result = append(result, r)
	}
	return result, nil
}

func (sf *ScrFieldModel) Insert(scrf ScrField) (sql.Result, error) {
	stm := `Insert Into "JIRA_SCREEN_FIELD"("SCREEN_ID", "FIELD_ID") Values(:1, :2)`
	return DbOracle.Db.Exec(stm, scrf.ScreenId, scrf.FieldId)
}
