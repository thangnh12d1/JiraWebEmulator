package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"
	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)
var RoleModels = RoleModel{}

type Role struct {
    RoleId int `json:"Role_Id"`
	RoleName string `json:"Role_Name"`
	RoleDescription string `json:"Role_Description"`
}

type RoleModel struct{
	Roles []Role
}

//get all 
func (pr *RoleModel) GetAllRole() ([]Role,error){
	var temp_role []Role
	//query
	smt := `SELECT * FROM NEW_JIRA_ROLE`
	rows, err := DbOracle.Db.Query(smt)
	if err == nil{
		for rows.Next(){
           role := Role{}
		   rows.Scan(
			   &role.RoleId, 
			   &role.RoleName,
			   &role.RoleDescription,
		   )
		   temp_role = append(temp_role, role)
		}
		return temp_role,nil
	}else{
		return nil, err
	}
}

//Create role 
func (pr *RoleModel) AddRole(role Role) (sql.Result,error){
	//add role from client to db
	smt := `INSERT INTO "NEW_JIRA_ROLE"("ROLE_NAME","ROLE_DESCRIPTION") VALUES (:1,:2)`
	return DbOracle.Db.Exec(smt,role.RoleName,role.RoleDescription)
}

//Check role exists by name role
func (pr *RoleModel) Check_Role_Exist(name string) ([]Role, error){
	var temp_role []Role
	//query role
	query := fmt.Sprintf("SELECT * FROM \"NEW_JIRA_ROLE\" WHERE \"ROLE_NAME\" = '%v' ",name)
    rows, err := DbOracle.Db.Query(query)
	if err== nil{
		for rows.Next(){
			role := Role{}
			//scan role
			rows.Scan(
				&role.RoleId,
				&role.RoleName,
				&role.RoleDescription,
			
			)
			
			//append role
			temp_role = append(temp_role, role)
			
				
		}
		return temp_role, nil
	}else{
		return nil,err
	}
}
func (pr *RoleModel) Check_Role_Exist_By_Id(id string) ([]Role, error){
	var temp_role []Role
	//query role
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_ROLE WHERE ROLE_ID = '%v' ",id)
    rows, err := DbOracle.Db.Query(query)
	if err== nil{
		for rows.Next(){
			role := Role{}
			//scan role
			rows.Scan(
				&role.RoleId,
				&role.RoleName,
				&role.RoleDescription,
			
			)
			
			//append role
			temp_role = append(temp_role, role)
			
				
		}
		return temp_role, nil
	}else{
		return nil,err
	}
}
//Update role
func (pr *RoleModel) UpdateRole(id int, strName string, strDescription string) (sql.Result, error) {
	var NameQuery, DescriptionQuery string
	if strName != ""{
		NameQuery = fmt.Sprintf("ROLE_NAME = '%v',",strName)
	}else{
		NameQuery = "ROLE_NAME=ROLE_NAME,"
	}
	//if Description != null so update ROLE_DESCRIPTION
	if strDescription !=""{
		DescriptionQuery = fmt.Sprintf("ROLE_DESCRIPTION='%v'",strDescription)
	}else{
		DescriptionQuery = "ROLE_DESCRIPTION=ROLE_DESCRIPTION"
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_ROLE" SET  %v %v  WHERE "ROLE_ID"=:1`, NameQuery, DescriptionQuery)
	return DbOracle.Db.Exec(smt, id)

}

//DELETE ROLE
//delete role by id user
func (sm *RoleModel) DeleteRole(id string) (sql.Result, error) {
	//query delete user by id
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_ROLE WHERE ROLE_ID = '%v'", id)
	return DbOracle.Db.Exec(query)
}
