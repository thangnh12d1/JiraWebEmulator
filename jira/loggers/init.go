package loggers

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/kjk/dailyrotate"
	"github.com/sirupsen/logrus"
	easy "github.com/t-tomalak/logrus-easy-formatter"
)

var (
	logFile *dailyrotate.File
	Logger  logrus.Logger
)

func init() {
	// setup for io writer
	logDir := "./logs"
	//ensure the directory already exists
	if err := os.MkdirAll(logDir, 0755); err != nil {
		log.Fatalf("os.MkdirAll()")
	}

	// fileNameFormat := fmt.Sprintf("%d%s", pid, "-2006-01-02.log") //it's just format type in Golang
	fileNameFormat := "2006-01-02.log" //it's just format type in Golang

	pathFormat := filepath.Join(logDir, fileNameFormat)
	if err := openLogFile(pathFormat, onLogClose); err != nil {
		log.Fatalf("The 'openLogFile' fail to open log file with '%s'\n", err)
	}
	//setup logrus
	Logger = logrus.Logger{
		Out:   logFile,
		Level: logrus.GetLevel(),
		Formatter: &easy.Formatter{
			TimestampFormat: "2006-01-02 15:04:05",
			LogFormat:       "[%lvl% \t- %time%] %msg%\n",
		},
	}
}

func openLogFile(pathFormat string, onClose func(string, bool)) error {
	w, err := dailyrotate.NewFile(pathFormat, onLogClose)
	if err != nil {
		return err
	}
	location, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		log.Println(err)
	}
	w.Location = location
	logFile = w
	return nil
}

func onLogClose(path string, didRotate bool) {
	fmt.Printf("We just close a file '%s', didRotate: %v\n", path, didRotate)
	if !didRotate {
		return
	}
	go func() {
		// if processing takes a long time, do it in background
	}()
}

func closeLogFile() error {
	return logFile.Close()
}
