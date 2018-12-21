package auth

import (
	"database/sql"
	"elmariachistudios.it/collection"
	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	Id         int    `json:"u_id"`
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Username   string `json:"id_name"`
	Avatar     string `json:"avatar"`
	Password   string `json:"password"`
	Token      string
	Collection []collection.OwnedCard `json:"collection"`
}

// func (u *User) getInfo() {
// 	db, err := sql.Open("mysql", "root:s8s8tif8@localhost:3306/MTGOrganizer")

// 	if err != nil {
// 		panic(err.Error())
// 	}

// }

func (u *User) init(username string, password string) {
	u.Username = username
	u.Password = password
}

func (u *User) GetInfo(username string) {
	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	err = db.QueryRow("SELECT u_id,name,surname,id_name,avatar,password from mtg_user where id_name =?", username).Scan(&u.Id, &u.Name, &u.Surname, &u.Username, &u.Avatar, &u.Password)

	if err != nil {
		panic(err.Error())
	}
}

func (u *User) GetCollection() {
	u.Collection = collection.RetrieveList(u.Id)
	// fmt.Print(u.Collection)
}

func (u *User) CheckCredentials(username string, password string) bool {
	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	err = db.QueryRow("SELECT u_id,name,surname,id_name,avatar,password from mtg_user where id_name =?", username).Scan(&u.Id, &u.Name, &u.Surname, &u.Username, &u.Avatar, &u.Password)

	if err != nil {
		panic(err.Error())
	}

	if u.Password != password {
		u = nil
		return false
	}

	return true
}
