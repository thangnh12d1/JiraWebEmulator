package configs

import "fmt"

var Configuration = &struct {
	Server   ServerConfig `yaml:"server"`
	Database OracleConfig `yaml:"database"`
}{}

type ServerConfig struct {
	Host          string
	Port          int32
	ValidToken    string `yaml:"valid_token"`
	MaxSizeUpload int    `yaml:"max_size"`
}

func (sc *ServerConfig) GetDomain() string {
	if sc.Port == 0 {
		return fmt.Sprintf("%v:80", sc.Host)
	}
	return fmt.Sprintf("%v:%v", sc.Host, sc.Port)
}

func (odb *OracleConfig) GetDBConnectionStr() string {
	//"user=\"jira\" password=\"MyGIAgVwrzQRj8lhD54k\" connectString=\"115.165.166.55:1521/COREDB\""
	return fmt.Sprintf("user=\"%v\" password=\"%v\" connectString=\"%v:%v/%v\"", odb.User, odb.Password, odb.Host, odb.Port, odb.Sn)
}

type OracleConfig struct {
	ConnectionString string `yaml:"connection_string"`
	Host             string `yaml:"host"`
	Port             string `yaml:"post"`
	User             string `yaml:"user"`
	Password         string `yaml:"password"`
	Sn               string `yaml:"sn"`
}
