package models

import (
	"database/sql"
	. "jira/common/db"
)

var ProScreenModels = ProScreenModel{}

type ProScreen struct {
	ScreenId   int    `json:"Screen_Id"`
	ProjectId  int    `json:"Project_Id"`
	ScreenType string `json:"Screen_Type"`
}

type ProScreenModel struct{}

func (ps *ProScreenModel) Get() ([]ProScreen, error) {
	rows, err := DbOracle.Db.Query("Select * From Jira_Project_Screen")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []ProScreen{}
	for rows.Next() {
		r := ProScreen{}
		rows.Scan(&r.ScreenId, &r.ProjectId, &r.ScreenType)
		result = append(result, r)
	}
	return result, nil
}

func (ps *ProScreenModel) Insert(pscr ProScreen) (sql.Result, error) {
	stm := `Insert Into "JIRA_PROJECT_SCREEN"("SCREEN_ID", "PROJECT_ID", "SCREEN_TYPE") Values(:1, :2, :3)`
	return DbOracle.Db.Exec(stm, pscr.ScreenId, pscr.ProjectId, pscr.ScreenType)
}
