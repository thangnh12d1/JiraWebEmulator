package db

import (
	"database/sql"
	"jira/configs"

	_ "github.com/godror/godror"
)

var DbOracle = NewDB()

type DBOracle struct {
	ConnStr string
	Db      *sql.DB
}

func (d *DBOracle) GetConnection() (*sql.DB, error) {
	connStr := configs.Configuration.Database.GetDBConnectionStr()
	db, err := sql.Open("godror", connStr)
	if err != nil {
		return nil, err
	}
	d.Db = db
	return d.Db, nil
}

func NewDB() DBOracle {
	configs.SetupServer()
	dbOrl := DBOracle{}
	dbOrl.GetConnection()
	return dbOrl
}
