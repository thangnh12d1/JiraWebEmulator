package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"

	_ "github.com/godror/godror"
)

var PermissionRoleModels = PemissionRoleModel{}
type PermissionRole struct{
	PermissionId int `json:"PermissionId"`
	RoleId int `json:"RoleId"`
	PermissionName string `json:"PermissionName"`
	RoleName string `json:"RoleName"`
}

type PemissionRoleModel struct{
	PermissionRoles []Permission
}
///
func (pr *PemissionRoleModel) GetAll(id string)([]PermissionRole,error){
	var temp_permissionrole []PermissionRole
	//sql
	 query :=fmt.Sprintf("SELECT NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID,NEW_JIRA_ROLE_PERMISSION.ROLE_ID,NEW_JIRA_PERMISSION.PERMISSION_NAME,NEW_JIRA_ROLE.ROLE_NAME FROM NEW_JIRA_PERMISSION, NEW_JIRA_ROLE_PERMISSION,NEW_JIRA_ROLE WHERE NEW_JIRA_PERMISSION.PERMISSION_ID=NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID  AND NEW_JIRA_ROLE_PERMISSION.ROLE_ID = NEW_JIRA_ROLE.ROLE_ID AND NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID ='%v'",id)

    rows,err := DbOracle.Db.Query(query)
	if err == nil{
		for rows.Next(){
			permissionrole := PermissionRole{}
			rows.Scan(
				&permissionrole.PermissionId,
				&permissionrole.RoleId,
				&permissionrole.PermissionName,
				&permissionrole.RoleName,
			)
			temp_permissionrole = append(temp_permissionrole, permissionrole)

		}
		return temp_permissionrole,nil
} else{
	return nil,err
}
	
}
func (pr *PemissionRoleModel) UpdatePermissionRole (idrole string,idpermission string,idRolenew string)	(sql.Result,error){
    var Query_temp string
	if idRolenew != ""{
		Query_temp = fmt.Sprintf("ROLE_ID= '%v'",idRolenew)
	}else{
		Query_temp = "ROLE_ID=ROLE_ID"
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_ROLE_PERMISSION" SET %v  WHERE "PERMISSION_ID"=:1 AND "ROLE_ID"=:2`, Query_temp)
	return DbOracle.Db.Exec(smt, idpermission,idrole)


}
//Add permission and role to db
func (pr *PemissionRoleModel) AddRoleToPermission (idpermission string, idrole string) (sql.Result,error){
	smt:= `INSERT INTO "NEW_JIRA_ROLE_PERMISSION"("PERMISSION_ID","ROLE_ID") VALUES (:1,:2)`
	return DbOracle.Db.Exec(smt,idpermission,idrole)
}

//check permissionrole already
func (pr *PemissionRoleModel) Check_Exist(idpermission string, idrole string) ([]PermissionRole,error){
   var temp_permissionrole []PermissionRole
   //query
   query := fmt.Sprintf("SELECT * FROM NEW_JIRA_ROLE_PERMISSION WHERE PERMISSION_ID ='%v' AND ROLE_ID ='%v' ",idpermission,idrole)
   rows,err := DbOracle.Db.Query(query)
	if err == nil{
		for rows.Next(){
			permissionrole := PermissionRole{}
			rows.Scan(
				&permissionrole.PermissionId,
				&permissionrole.RoleId,
			)
			temp_permissionrole = append(temp_permissionrole, permissionrole)
		}
		return temp_permissionrole,nil
   }else{
	   return nil,err
   }
}


//Delete permissionrole 
func (pr *PemissionRoleModel) DeletePermissionRole(idpermission string, idrole string) (sql.Result,error){
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_ROLE_PERMISSION  WHERE PERMISSION_ID ='%v' AND ROLE_ID ='%v' ",idpermission,idrole)
	return DbOracle.Db.Exec(query)
}


