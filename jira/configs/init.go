package configs

import (
	"fmt"

	"github.com/spf13/viper"
)

func SetupServer() {
	viper.SetConfigName("conf")
	viper.AddConfigPath("./configs")
	//viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}
	err := viper.Unmarshal(Configuration)
	if err != nil {
		panic(fmt.Errorf("unable to decode into config struct, %v", err))
	}
}
