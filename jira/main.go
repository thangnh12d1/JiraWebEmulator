package main

import (
	"jira/configs"
	"jira/routes"
)

func init() {
	configs.SetupServer()
}

func main() {
	router := routes.InitRoutes()
	router.Run(configs.Configuration.Server.GetDomain())
}
