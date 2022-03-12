package middleware

import (
	"fmt"
	"jira/loggers"

	"github.com/gin-gonic/gin"
)

func OutputWithJSON(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.Next()
}

func CORS(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Header("Access-Control-Allow-Methods", "POST, HEAD, PATCH, OPTIONS, GET, DELETE, PUT")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}

func LogRequestToFile(c *gin.Context) {

	uri := c.Request.RequestURI
	method := c.Request.Method
	status := c.Writer.Status()
	s := fmt.Sprintf("%s\t%s\t%v", uri, method, status)
	loggers.Logger.Println(s)
	c.Next()
}
