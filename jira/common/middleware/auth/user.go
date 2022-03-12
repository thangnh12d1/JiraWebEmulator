package auth

import (
	"fmt"
	"jira/common/helpers"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
	"github.com/twinj/uuid"
	// "encoding/json"
)

var client *redis.Client

func init() {
	//Initializing redis
	dsn := os.Getenv("REDIS_DSN")
	if len(dsn) == 0 {
		dsn = "localhost:6379"
	}
	client = redis.NewClient(&redis.Options{
		Addr: dsn, //redis port
	})
	_, err := client.Ping().Result()
	if err != nil {
		panic(err)
	}
}

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	AtExpires    int64
	RtExpires    int64
}
type AccessDetails struct {
	AccessUuid string
	UserId     int64
	GlobalRole int64
}

//create token
func CreateToken(userid int64, globalrole int64) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 60).Unix()
	td.AccessUuid = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Minute * 60 * 24).Unix()
	td.RefreshUuid = td.AccessUuid + "++" + strconv.Itoa(int(userid))

	var err error
	//Creating Access Token
	os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	atClaims["userid"] = userid
	atClaims["globalrole"] = globalrole
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	//Creating Refresh Token
	os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims["userid"] = userid
	rtClaims["globalrole"] = globalrole
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}
	return td, nil
}
func CreateAuth(userid int64, td *TokenDetails) error {
	at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
	rt := time.Unix(td.RtExpires, 0)
	now := time.Now()

	errAccess := client.Set(td.AccessUuid, userid, at.Sub(now)).Err()
	if errAccess != nil {
		return errAccess
	}
	errRefresh := client.Set(td.RefreshUuid, userid, rt.Sub(now)).Err()
	if errRefresh != nil {
		return errRefresh
	}
	return nil
}

func ExtractToken(r *http.Request) string {
	bearToken := r.Header.Get("Authorization")
	//normally Authorization the_token_xxx
	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}
func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

//get data from token
func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUuid, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}
		userid, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["userid"]), 10, 64)
		if err != nil {
			return nil, err
		}
		globalrole, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["globalrole"]), 10, 64)
		if err != nil {
			return nil, err
		}

		return &AccessDetails{
			AccessUuid: accessUuid,
			UserId:     userid,
			GlobalRole: globalrole,
		}, nil
	}
	return nil, err
}

//////////////
func CheckUserLoged(c *gin.Context) {
	var tknStr string
	var tknStr1 string
	var rule bool

	auth := c.Request.Header["Authorization"]
	if len(auth) > 0 {
		tknStr = strings.Trim(auth[0], "Bearer")
		tknStr1 = strings.Trim(tknStr, " ")
		tkn, err := jwt.Parse(tknStr1, func(token *jwt.Token) (interface{}, error) {
			//Make sure that the token method conform to "SigningMethodHMAC"
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("ACCESS_SECRET")), nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Invalid signature"})
				c.Abort()
			}
			rule = false
		} else {
			rule = true
		}

		if rule && tkn != nil {
			claims, _ := tkn.Claims.(jwt.MapClaims)
			accessUuid, _ := claims["access_uuid"].(string)
			_, ok := client.Get(accessUuid).Result()
			if ok != nil {
				c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token failed"})
				c.Abort()
			} else {
				c.Next()
			}

		}
		if !rule && tkn != nil {
			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token expired, please login again"})
			c.Abort()
		}
		if tkn == nil {
			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token invalid"})
			c.Abort()
		}

	} else {
		c.Abort()
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token not found"})
	}
	c.Abort()
}

func CheckAdmin(c *gin.Context) {
	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	}
	if tokenAuth.GlobalRole == 0 {
		c.Next()
	}
	if tokenAuth.GlobalRole == 1 {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	}
	if tokenAuth.GlobalRole == 2 {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	}
	c.Abort()
}
func CheckTrusted(c *gin.Context) {
	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	}
	if tokenAuth.GlobalRole == 0 {
		c.Next()
	}
	if tokenAuth.GlobalRole == 1 {
		c.Next()
	}
	if tokenAuth.GlobalRole == 2 {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin or leader, can't access"})
		c.Abort()
	}
	c.Abort()
}

///Delete when logout
func DeleteAuth(givenUuid string) (int64, error) {
	deleted, err := client.Del(givenUuid).Result()
	if err != nil {
		return 0, err
	}
	return deleted, nil
}
func Logout(c *gin.Context) {
	var tknStr string
	var tknStr1 string
	auth := c.Request.Header["Authorization"]
	tknStr = strings.Trim(auth[0], "Bearer")
	tknStr1 = strings.Trim(tknStr, " ")

	tkn, _ := jwt.Parse(tknStr1, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	claims, _ := tkn.Claims.(jwt.MapClaims)
	accessUuid, _ := claims["access_uuid"].(string)
	deleted, delErr := DeleteAuth(accessUuid)
	if delErr != nil || deleted == 0 { //if any goes wrong
		c.JSON(http.StatusUnauthorized, "unauthorized")
		c.Abort()
	} else {
		c.JSON(http.StatusOK, "Successfully logged out")
		c.Next()
	}
}

//refresh token
func RefreshToken(c *gin.Context) {
	mapToken := map[string]string{}
	if err := c.ShouldBindJSON(&mapToken); err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	refreshToken := mapToken["refresh_token"]
	//verify the token
	os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})
	//if there is an error, the token must have expired
	if err != nil {
		c.JSON(http.StatusUnauthorized, "Refresh token expired")
		return
	}
	//is token valid?
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	fmt.Println(claims)
	if ok && token.Valid {
		refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
		if !ok {
			c.JSON(http.StatusUnprocessableEntity, err)
			return
		}
		// username, ok := claims["username"].(string)
		userid, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["userid"]), 10, 64)
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, "Error occurred")
			c.Abort()
		}
		globalrole, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["globalrole"]), 10, 64)
		fmt.Println(globalrole)
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, "Error occurred")
			c.Abort()
		}
		fmt.Println(globalrole)
		//Delete the previous Refresh Token
		deleted, delErr := DeleteAuth(refreshUuid)
		if delErr != nil || deleted == 0 { //if any goes wrong
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		//Create new pairs of refresh and access tokens
		ts, createErr := CreateToken(userid, globalrole)
		if createErr != nil {
			c.JSON(http.StatusForbidden, createErr.Error())
			return
		}
		//save the tokens metadata to redis
		saveErr := CreateAuth(userid, ts)
		if saveErr != nil {
			c.JSON(http.StatusForbidden, saveErr.Error())
			return
		}
		tokens := map[string]string{
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}
		c.JSON(http.StatusCreated, tokens)
	} else {
		c.JSON(http.StatusUnauthorized, "refresh expired")
	}
}
