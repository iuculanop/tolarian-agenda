package auth

import (
	"database/sql"

	"elmariachistudios.it/collection"
	_ "github.com/go-sql-driver/mysql"
)

const DBAuth string = "tolagenda:S8s8m3n3f8!@tcp(localhost:3306)/MTGOrganizer?parseTime=true"

type Friendship struct {
	firstMember  int
	secondMember int
	status       int
}

type BaseUser struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Username string `json:"idName"`
	Avatar   string `json:"avatar"`
}

type User struct {
	Id         int    `json:"u_id"`
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Username   string `json:"id_name"`
	Avatar     string `json:"avatar"`
	Password   string `json:"password"`
	Token      string
	Collection []collection.OwnedCard `json:"collection"`
	Friends    []BaseUser             `json:"friendList"`
}

// func (u *User) getInfo() {
// 	db, err := sql.Open("mysql", "root:s8s8tif8@localhost:3306/MTGOrganizer")

// 	if err != nil {
// 		panic(err.Error())
// 	}

// }

func (fs *Friendship) getFriendInfo(id int) BaseUser {

	var idf int
	var user BaseUser
	if fs.firstMember == id {
		idf = fs.secondMember
	} else {
		idf = fs.firstMember
	}

	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	errQ := db.QueryRow("SELECT u_id, name, surname, id_name, avatar from mtg_user WHERE u_id = ?", idf).
		Scan(&user.Id, &user.Name, &user.Surname, &user.Username, &user.Avatar)

	if errQ != nil {
		panic(errQ)
	}

	return user

}

func (u *User) init(username string, password string) {
	u.Username = username
	u.Password = password
}

func (u *User) GetInfo(username string) {
	db, err := sql.Open("mysql", DBAuth)

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

func (u *User) GetFriends() {
	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	results, errQ := db.Query("SELECT u_id_first, u_id_second, status FROM mtg_friends WHERE (u_id_first = ? OR u_id_second = ?) AND status = 1", u.Id, u.Id)

	if errQ != nil {
		u.Friends = []BaseUser{}
		panic(errQ)
	}

	for results.Next() {
		var fs Friendship
		errScan := results.Scan(&fs.firstMember, &fs.secondMember, &fs.status)

		if errScan != nil {
			u.Friends = []BaseUser{}
			panic(errScan)
		}

		friend := fs.getFriendInfo(u.Id)
		u.Friends = append(u.Friends, friend)
	}

}

func (u *User) CheckCredentials(username string, password string) bool {
	db, err := sql.Open("mysql", DBAuth)

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
