package handlers

import (
	"bytes"
	"encoding/base64"

	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/godror/godror"
	"io/ioutil"
	"jira/common/helpers"
	. "jira/common/middleware/auth"
	"jira/models"
	"log"
	"net/http"
	"net/smtp"
	"strconv"
	"text/template"
)

var UserHandlers = UserHandler{}

type UserHandler struct{}

//redis

///login
func (u *UserHandler) Singin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var username, password string

		// 		//var user string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)

		username = fmt.Sprintf("%v", myMap["username"])
		password = fmt.Sprintf("%v", myMap["password"])
        fmt.Println(username)
		fmt.Println(password)
		//check null
		if username == "" || password == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exists_user, err := models.UserModels.Check_User_Exist(username, username)
		    fmt.Println(Exists_user[0])
			if err != nil {

				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			//No have user
			if len(Exists_user) == 0 {
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "User not exists, please choose another user"})
			}
			if len(Exists_user) == 1 {
				//User admin
				if Exists_user[0].IsAdmin == 0 {
					originalStringBytes, err := base64.StdEncoding.DecodeString(Exists_user[0].UserPassword)
                    
					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}
					//compare password
					if password == string(originalStringBytes) {
						ts, err := CreateToken(int64(Exists_user[0].UserId), int64(Exists_user[0].IsAdmin))
						if err != nil {
							c.JSON(http.StatusUnprocessableEntity, err.Error())
							return
						}
						saveErr := CreateAuth(int64(Exists_user[0].UserId), ts)
						if saveErr != nil {
							c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
						}
						tokens := map[string]string{
							"access_token":  ts.AccessToken,
							"refresh_token": ts.RefreshToken,
						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: tokens})

					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}
				//trusted user
				if Exists_user[0].IsAdmin == 1 {

					originalStringBytes, err := base64.StdEncoding.DecodeString(Exists_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}

					if password == string(originalStringBytes) {
						ts, err := CreateToken(int64(Exists_user[0].UserId), int64(Exists_user[0].IsAdmin))
						if err != nil {
							c.JSON(http.StatusUnprocessableEntity, err.Error())
							return
						}
						saveErr := CreateAuth(int64(Exists_user[0].UserId), ts)
						if saveErr != nil {
							c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
						}

						tokens := map[string]string{
							"access_token":  ts.AccessToken,
							"refresh_token": ts.RefreshToken,
						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: tokens})

					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}

				//member
				if Exists_user[0].IsAdmin == 2 {

					originalStringBytes, err := base64.StdEncoding.DecodeString(Exists_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}

					if password == string(originalStringBytes) {
						ts, err := CreateToken(int64(Exists_user[0].UserId), int64(Exists_user[0].IsAdmin))
						if err != nil {
							c.JSON(http.StatusUnprocessableEntity, err.Error())
							return
						}
						saveErr := CreateAuth(int64(Exists_user[0].UserId), ts)
						if saveErr != nil {
							c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
						}
						tokens := map[string]string{
							"access_token":  ts.AccessToken,
							"refresh_token": ts.RefreshToken,
						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: tokens})

					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}

			}
		}
	}
}

//func get All user
func (u *UserHandler) Index() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		//call model
		users, err := models.UserModels.GetAllUser()
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: users})
		} else {
			fmt.Println(err)
		}
	}
}

//Create User
func (u *UserHandler) CreateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		//req body
		var username, fullname, email, password, global_role string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//user_name
		username = fmt.Sprintf("%v", myMap["username"])
		//full_name
		fullname = fmt.Sprintf("%v", myMap["fullname"])
		//email
		email = fmt.Sprintf("%v", myMap["email"])
		//password
		password = fmt.Sprintf("%v", myMap["password"])
		//global_role
		global_role = fmt.Sprintf("%v", myMap["globalrole"])
		if username == "" || fullname == "" || email == "" || password == "" || global_role == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			//check user exist from db
			//call model
			exist_user, err := models.UserModels.Check_User_Exist(username, email)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			//if user exists
			if len(exist_user) > 0 {
				if exist_user[0].UserName == username && exist_user[0].UserEmail != email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "UserName already exists, please choose another user"})
				}
				if exist_user[0].UserName != username && exist_user[0].UserEmail == email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Email already exists, please choose another email"})
				}
				if exist_user[0].UserName == username && exist_user[0].UserEmail == email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "UserName and Email already exists, please choose another email"})
				}
			}
			if len(exist_user) == 0 {
				//convert string to int wwith global role
				global_role_int, _ := strconv.Atoi(global_role)
				//send mail
				_, err := sendEmail(email, password, username, fullname)
				if err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
				} else {
					//hash Password
					temp := password
					hashPassword := base64.StdEncoding.EncodeToString([]byte(temp))
					//
					src := models.User{
						UserName:     username,
						UserFullName: fullname,
						UserEmail:    email,
						UserPassword: hashPassword,
						IsAdmin:      global_role_int,
					}
					sm := models.UserModel{}
					//Add user
					if _, err := sm.AddUser(src); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success"})
					}
				}
			}

		}
	}
}

///func delete user by id user
func (u *UserHandler) DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		//query id from client
		id := c.Query("id")
		//if id null
		if id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			//call model func check user exist by user's id
			Check_user_exists, err := models.UserModels.Check_User_Exist_By_Id(id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				//no have user in db
				if len(Check_user_exists) == 0 {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "User Id does not exist"})
					//have user in db
				} else if len(Check_user_exists) > 0 {
					//delete user
					if _, err := models.UserModels.DeleteUser(id); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
					}
				}
			}
		}
	}
}

//func update info user by admin
func (u *UserHandler) UpdateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var fullname, password, isAdmin string
		id := c.Query("id")
		var myMap map[string]string
		//req body from client
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//username
		fullname = fmt.Sprintf("%v", myMap["User_Full_Name"])
		//password
		password = fmt.Sprintf("%v", myMap["User_Password"])
		//permission role
		isAdmin = fmt.Sprintf("%v", myMap["globalrole"])
		//convert id string -> id int
		user_id, _ := strconv.Atoi(id)
		//hash password
		hashPassword := base64.StdEncoding.EncodeToString([]byte(password))
		if _, err := models.UserModels.UpdateUser(user_id, fullname, hashPassword, isAdmin); err != nil {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

		} else {
			Check_user_exists, err := models.UserModels.Check_User_Exist_By_Id(id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update user success", Data: Check_user_exists[0]})
			}
		}
	}
}

//get user by id
func (u *UserHandler) GetUserbyId() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		//call model
		id_user := c.Query("id")
		users, err := models.UserModels.Check_User_Exist_By_Id(id_user)
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: users[0]})
		} else {
			fmt.Println(err)
		}
	}
}

//get user by token
func (u *UserHandler) GetUserbyTokenUser() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		//call model
		tokenAuth, error := ExtractTokenMetadata(c.Request)
		if error != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
		}
		user_id := strconv.FormatInt(tokenAuth.UserId, 10)
		users, err := models.UserModels.Check_User_Exist_By_Id(user_id)
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: users[0]})
		} else {
			c.JSON(http.StatusFound, helpers.MessageResponse{Msg: "User null"})
		}
	}
}
func toBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

//save image to db

func (u *UserHandler) StoreImage() gin.HandlerFunc {
	return func(c *gin.Context) {
		file, _, err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
				"error":   true,
			})
			return
		}
		defer file.Close()
		files, err := ioutil.ReadAll(file)
		mimeType := http.DetectContentType(files)
		var base64Encoding string
		switch mimeType {
		case "image/jpeg":
			base64Encoding += "data:image/jpeg;base64,"
		case "image/png":
			base64Encoding += "data:image/png;base64,"
		case "image/jpg":
			base64Encoding += "data:image/jpg;base64,"
		}
		if _, err := models.UserModels.Image(files); err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
		} 
			base64Encoding += toBase64(files)
			// Print the full base64 representation of the image
			c.JSON(http.StatusOK, base64Encoding)
		// }
		// Append the base64 encoded output

		// defer f.Close()
		// 	// filename := header.Filename
		// 	dat, err := ioutil.ReadFile(uploadedFile)
		// 	if err != nil {
		// 		fmt.Println(".....Error Opening File")
		// 		fmt.Println(err)
		// 		return
		// 	}
		// 	fmt.Println(dat)

	}
}

//mail
func sendEmail(receiversMail string, password string, username string, fullname string) (bool, error) {
	// Sender data.
	from := "phucotrithihamhoc@gmail.com"
	passwordEmail := "baflhzzxihredlqp"
	//
	// Receiver email address.
	to := []string{
		receiversMail,
	}
	// smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	// Authentication.
	auth := smtp.PlainAuth("", from, passwordEmail, smtpHost)
	t, _ := template.ParseFiles("templates/template.html")
	var body bytes.Buffer

	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body.Write([]byte(fmt.Sprintf("Subject: Hello \n%s\n\n", mimeHeaders)))

	t.Execute(&body, struct {
		FullName string
		UserName string
		Password string
	}{
		FullName: fullname,
		UserName: username,
		Password: password,
	})

	// Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, body.Bytes())
	if err != nil {
		fmt.Println(err)
		return false, err
	}
	return true, nil

}
