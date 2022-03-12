package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	. "jira/common/db"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var ProjectsModels = ProjectsModel{}

// var ProjectModels = Project{}

type Project struct {
	ProjectKey string `json:"ProjectKey"`
	//ProjectId          int
	ProjectName string `json:"ProjectName"`
	ProjectUrl  string `json:"ProjectUrl"`
	//DefaultAssignee    int
	ProjectAvatar      string `json:"ProjectAvatar"`
	ProjectDescription string `json:"ProjectDescription"`

	ProjectLead int `json:"ProjectLead"`

	WorkflowId      int    `json:"WorkflowId"` // New addition
	ProjectLeadName string `json:"ProjectLeadName"`
	// WorkflowName    string `json:"WorkflowName"`
}

type ProjectsModel struct {
	Projects []Project
}

//Lấy thông tin tất cả Project có trong db
func (pm *ProjectsModel) Get() ([]Project, error) {
	var ListProjects []Project

	rows, err := DbOracle.Db.Query("SELECT A.PROJECT_KEY, A.PROJECT_NAME, A.PROJECT_URL, A.PROJECT_AVATAR, A.PROJECT_DESCRIPTION, A.PROJECT_LEAD, B.ID_WORKFLOW, C.USER_NAME FROM NEW_JIRA_PROJECT A, NEW_JIRA_WORKFLOWPROJECT B, NEW_JIRA_USER C WHERE A.PROJECT_KEY = B.PROJECT_KEY AND A.PROJECT_LEAD = C.USER_ID")

	// a := byte([]`{}`)

	if err == nil {

		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			project := Project{}

			rows.Scan(&project.ProjectKey, &project.ProjectName, &project.ProjectUrl, &project.ProjectAvatar, &project.ProjectDescription, &project.ProjectLead, &project.WorkflowId, &project.ProjectLeadName)

			ListProjects = append(ListProjects, project)
		}
		fmt.Println(ListProjects)
		return ListProjects, nil
	} else {
		return nil, err
	}
}

// Lấy 1 Project dựa vào Key

func (pm *ProjectsModel) GetByIdWorkflow(id string) ([]Project, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_PROJECT where ID_WORKFLOW = '%v'", id)

	// fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	// a := byte([]`{}`)

	if err == nil {
		var ListProjects []Project
		// fmt.Println(rows.Next())
		for rows.Next() {
			// fmt.Println(err.Error())
			project := Project{}
			rows.Scan(&project.ProjectKey, &project.ProjectName, &project.ProjectUrl, &project.ProjectAvatar, &project.ProjectDescription, &project.ProjectLead)
			// fmt.Println(project)
			ListProjects = append(ListProjects, project)
		}
		return ListProjects, nil
	} else {
		return nil, err
	}
}

// Tạo Project
func (pm *ProjectsModel) CreateProject(r io.ReadCloser) ([]Project, error) {
	var project Project
	json.NewDecoder(r).Decode(&project)
	// fmt.Println(project)
	//query := fmt.Sprintf("INSERT INTO JIRA_PROJECT (PROJECT_NAME, PROJECT_LEAD, PROJECT_URL, PROJECT_DESCRIPTION, PROJECT_AVATAR, PROJECT_KEY) VALUES('%v', %v, '%v', '%v', '%v', '%v')", project.ProjectName, project.ProjectLead, project.ProjectUrl, project.ProjectDescription, project.ProjectAvatar, project.ProjectKey)
	query := fmt.Sprintf("INSERT INTO NEW_JIRA_PROJECT (PROJECT_KEY, PROJECT_NAME, PROJECT_URL, PROJECT_AVATAR, PROJECT_DESCRIPTION, PROJECT_LEAD) VALUES(%v, %v, '%v', %v, '%v', '%v', '%v')", project.ProjectKey, project.ProjectName, project.ProjectUrl, project.ProjectAvatar, project.ProjectDescription, project.ProjectLead)
	// query := "INSERT INTO JIRA_PROJECT (PROJECT_NAME, PROJECT_LEAD, PROJECT_URL, DEFAULT_ASSIGNEE, PROJECT_DESCRIPTION, PROJECT_AVATAR, PROJECT_KEY) VALUES('project_name92', 41, 'link92', 1, 'description92', 'link92', 'abc') RETURNING PROJECT_ID into v_id"
	_, err := DbOracle.Db.Exec(query)
	// fmt.Println(result)
	// fmt.Println(query)
	// fmt.Println(result)

	if err == nil {

		// var projects []Project
		// rows.Scan(&project.Project_Id, &project.Project_Name, &project.Project_Lead, &project.Project_Url, &project.Default_Assignee, &project.Project_Description, &project.Project_Avatar)

		//rowsLastRecord, errLastRecord := DbOracle.Db.Query("SELECT * FROM (SELECT * FROM JIRA_PROJECT ORDER BY PROJECT_ID DESC) WHERE ROWNUM = 1")

		rowsLastRecord, errLastRecord := DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_PROJECT ORDER BY PROJECT_KEY DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListProjects []Project
			// fmt.Println(rows.Next())
			for rowsLastRecord.Next() {
				// fmt.Println(err.Error())
				project := Project{}
				rowsLastRecord.Scan(&project.ProjectKey, &project.ProjectName, &project.ProjectUrl, &project.ProjectAvatar, &project.ProjectDescription, &project.ProjectLead)
				// fmt.Println(project)
				ListProjects = append(ListProjects, project)
			}
			return ListProjects, nil
		} else {
			return nil, err
		}
		// projects = append(projects, project)

		// return projects, nil
	} else {
		return nil, err
	}
}
func (pm *ProjectsModel) InsertProject(project Project) (sql.Result, error) {

	fmt.Println(project)
	smt := `INSERT INTO "NEW_JIRA_PROJECT"("PROJECT_KEY", "PROJECT_NAME", "PROJECT_DESCRIPTION","PROJECT_LEAD") VALUES (:1, :2, :3, :4)`

	return DbOracle.Db.Exec(smt, project.ProjectKey, project.ProjectName, project.ProjectDescription, project.ProjectLead)

}
func (pm *ProjectsModel) InsertProjectInProjectWorkflow(project Project) (sql.Result, error) {
	fmt.Println(project)
	smt := `INSERT INTO "NEW_JIRA_WORKFLOWPROJECT"("PROJECT_KEY", "ID_WORKFLOW") VALUES (:1, :2)`

	return DbOracle.Db.Exec(smt, project.ProjectKey, project.WorkflowId)

}

// Chỉnh sửa Project
func (pm *ProjectsModel) UpdateProject(r io.ReadCloser, key string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	// fmt.Println(myMap)
	query := UpdateQuery(myMap, key)
	// query := fmt.Sprintf("UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', PROJECT_AVATAR = '%v', PROJECT_DESCRIPTION = '%v' = '%v'  WHERE PROJECT_KEY = '%v'", project.Project_Name, project.Project_Lead, project.Project_Url, project.Project_Avatar, project.Project_Description, project.Workflow_, id)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {

		rowsAffect, _ := row.RowsAffected()
		// fmt.Println(rowsAffectErr)
		if rowsAffect == 0 {
			return "", errors.New("no row affect")
		}
		return "Update successfully", nil
	} else {
		// fmt.Println(row.RowsAffected())
		return "", err
	}

	// return "abc", nil
}

// Xóa project
func (pm *ProjectsModel) DeleteProjectInWorkflow(key string) ([]Project, error) {
	var project Project
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_WORKFLOWPROJECT WHERE PROJECT_KEY = '%v'", key)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {
		var projects []Project
		projects = append(projects, project)

		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return projects, nil
	} else {
		return nil, err
	}
}
func (pm *ProjectsModel) DeleteProject(key string) (sql.Result, error) {
	fmt.Println(key)
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_PROJECT WHERE PROJECT_KEY = '%v'", key)
	return DbOracle.Db.Exec(query)
}

func UpdateQuery(project map[string]interface{}, key string) string {
	// "UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = '%v', PROJECT_AVATAR = '%v' WHERE PROJECT_ID = '%v'", project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar, id)""
	// "project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar"
	var ProjectNameVal, ProjectUrlVal, ProjectAvatarVal, ProjectDescriptionVal, ProjectLeadVal string
	// a := project["Project_Name"]
	// fmt.Println(a)
	if project["ProjectName"] != nil {
		ProjectNameVal = fmt.Sprintf("'%v'", project["ProjectName"])
	} else {
		ProjectNameVal = "PROJECT_NAME"
	}

	if project["ProjectLead"] != nil {
		ProjectLeadVal = fmt.Sprintf("'%v'", project["ProjectLead"])
	} else {
		ProjectLeadVal = "PROJECT_LEAD"
	}

	if project["ProjectUrl"] != nil {
		ProjectUrlVal = fmt.Sprintf("'%v'", project["ProjectUrl"])
	} else {
		ProjectUrlVal = "PROJECT_URL"
	}
	/*
		if project["DefaultAssignee"] != nil {
			ProjectDefaultAssigneeVal = fmt.Sprintf("'%v'", project["DefaultAssignee"])
		} else {
			ProjectDefaultAssigneeVal = "DEFAULT_ASSIGNEE"
		}
	*/
	if project["ProjectAvatar"] != nil {
		ProjectAvatarVal = fmt.Sprintf("'%v'", project["ProjectAvatar"])
	} else {
		ProjectAvatarVal = "PROJECT_AVATAR"
	}

	if project["ProjectDescription"] != nil {
		ProjectDescriptionVal = fmt.Sprintf("'%v'", project["ProjectDescription"])
	} else {
		ProjectDescriptionVal = "PROJECT_DESCRIPTION"
	}

	query := fmt.Sprintf("UPDATE NEW_JIRA_PROJECT SET PROJECT_NAME = %v, PROJECT_URL = %v, PROJECT_AVATAR = %v, PROJECT_DESCRIPTION = %v, PROJECT_LEAD = %v WHERE PROJECT_KEY = '%v'", ProjectNameVal, ProjectUrlVal, ProjectAvatarVal, ProjectDescriptionVal, ProjectLeadVal, key)

	return query
}

//Lấy project mới được thêm vào bằng projectkey
func (pr *ProjectsModel) GetProjectLeadByKeyProject(projectkey string) ([]Project, error) {
	var ListProjects []Project
	query := fmt.Sprintf("SELECT P.*,B.ID_WORKFLOW, U.USER_NAME FROM NEW_JIRA_PROJECT P, NEW_JIRA_USER U, NEW_JIRA_WORKFLOWPROJECT B WHERE P.PROJECT_LEAD = U.USER_ID AND P.PROJECT_KEY = '%v' AND P.PROJECT_KEY = B.PROJECT_KEY", projectkey)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {

		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			project := Project{}
			rows.Scan(&project.ProjectKey, &project.ProjectName, &project.ProjectUrl, &project.ProjectAvatar, &project.ProjectDescription, &project.ProjectLead, &project.WorkflowId, &project.ProjectLeadName)
			ListProjects = append(ListProjects, project)
		}
		return ListProjects, nil
	} else {
		return nil, err
	}
}

func (pm *ProjectsModel) Check_project(n string, k string) ([]Project, error) {
	var temp_project []Project
	query := fmt.Sprintf("SELECT A.PROJECT_KEY, A.PROJECT_NAME, A.PROJECT_URL, A.PROJECT_AVATAR, A.PROJECT_DESCRIPTION, A.PROJECT_LEAD, B.ID_WORKFLOW FROM NEW_JIRA_PROJECT A, NEW_JIRA_WORKFLOWPROJECT B WHERE A.PROJECT_KEY = '%v' AND A.PROJECT_KEY = B.PROJECT_KEY", k)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			project := Project{}

			rows.Scan(&project.ProjectKey, &project.ProjectName, &project.ProjectUrl, &project.ProjectAvatar, &project.ProjectDescription, &project.ProjectLead, &project.WorkflowId)

			temp_project = append(temp_project, project)
		}
		return temp_project, nil
	} else {
		return nil, err
	}
}

//get user's project
func (pr *ProjectsModel) GetProjectUser(userid int) ([]Project, error) {
	var temp_project []Project
	query := fmt.Sprintf("SELECT p.*,i.ID_WORKFLOW,u.user_name FROM NEW_JIRA_USER u,NEW_JIRA_PROJECT p,NEW_JIRA_USER_PROJECT_ROLE upr , NEW_JIRA_WORKFLOWPROJECT i WHERE upr.PROJECT_KEY = p.project_key AND u.USER_ID = p.PROJECT_LEAD AND upr.user_id= '%v' AND p.PROJECT_KEY = i.PROJECT_KEY", userid)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			project := Project{}
			rows.Scan(&project.ProjectKey, &project.ProjectName, &project.ProjectUrl, &project.ProjectAvatar, &project.ProjectDescription, &project.ProjectLead, &project.WorkflowId, &project.ProjectLeadName)
			temp_project = append(temp_project, project)
		}
		return temp_project, nil
	} else {
		return nil, err
	}

}

func (pm *ProjectsModel) GetAllProjectKey() ([]Project, error) {
	var ListProjects []Project
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_WORKFLOWPROJECT WHERE ID_WORKFLOW > 0")
	// a := byte([]`{}`)

	if err == nil {

		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			project := Project{}
			rows.Scan(&project.WorkflowId, &project.ProjectKey)
			ListProjects = append(ListProjects, project)
		}
		return ListProjects, nil

	} else {
		return nil, err
	}
}
