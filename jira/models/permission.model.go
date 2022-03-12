package models

import (
	"fmt"
	. "jira/common/db"
	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var PermissionModels = PermissionModel{}

type Permission struct {
	PermissionId int `json:"Permission_Id"`
	PermissionName string `json:"Permission_Name"`
	PermissionType string `json:"Permission_Type"`
	PermissionDescription string `json:"Permission_Description"`
}

type PermissionModel struct{
	Permissions []Permission
}

func (pr *PermissionModel) GetAllPermission() ([]Permission,error){
	var temp_permission []Permission
	//sql
	smt := `SELECT * FROM NEW_JIRA_PERMISSION`
	rows, err := DbOracle.Db.Query(smt)
	if err == nil{
            for rows.Next(){
				permission := Permission{}
				rows.Scan(
					&permission.PermissionId,
					&permission.PermissionName,
					&permission.PermissionType,
					&permission.PermissionDescription,
				)
				temp_permission = append(temp_permission, permission)

			}
			return temp_permission,nil
	} else{
		return nil,err
	}
}

//getPermission and role

func (pr *PermissionModel) GetPermissionUserInProject(key_project string, user_id int) ([]Permission,error){
	var temp_permission []Permission
	//sql
	query := fmt.Sprintf( `SELECT NEW_JIRA_PERMISSION.PERMISSION_ID, NEW_JIRA_PERMISSION.PERMISSION_NAME  FROM NEW_JIRA_USER_PROJECT_ROLE, NEW_JIRA_ROLE_PERMISSION,NEW_JIRA_PERMISSION WHERE NEW_JIRA_ROLE_PERMISSION.ROLE_ID = NEW_JIRA_USER_PROJECT_ROLE.ROLE_ID AND NEW_JIRA_PERMISSION.PERMISSION_ID = NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID AND NEW_JIRA_USER_PROJECT_ROLE.USER_ID ='%v' AND NEW_JIRA_USER_PROJECT_ROLE.PROJECT_KEY='%v'`,user_id,key_project)
	rows, err := DbOracle.Db.Query(query)
	if err == nil{
            for rows.Next(){
				permission := Permission{}
				rows.Scan(
					&permission.PermissionId,
					&permission.PermissionName,
				)
				temp_permission = append(temp_permission, permission)

			}
			return temp_permission,nil
	} else{
		return nil,err
	}
}




