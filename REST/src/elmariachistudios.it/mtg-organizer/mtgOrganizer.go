package main

import (
	"elmariachistudios.it/auth"
	"elmariachistudios.it/collection"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/MagicTheGathering/mtg-sdk-go"
	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

var (
	// declaring environment variables
	debug   bool
	port    string
	logPath string

	// declaring logging variables
	logTrace   *log.Logger
	logInfo    *log.Logger
	logWarning *log.Logger
	logError   *log.Logger
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ResponseRequest struct {
	PayLoad   interface{} `json:"payLoad"`
	ReturnMsg string      `json:"returnMsg"`
	ErrorMsg  string      `json:"errorMsg"`
}

// NON SERVONO PIU, DA RIMUOVERE
// type AuthResponseRequest struct {
// 	PayLoad   auth.User `json:"payLoad"`
// 	ReturnMsg string    `json:"returnMsg"`
// 	Error     string    `json:"errorMsg"`
// }

// type SetsResponseRequest struct {
// 	PayLoad   []*mtg.Set `json:"payLoad"`
// 	ReturnMsg string     `json:"returnMsg"`
// 	Error     string     `json:"errorMsg"`
// }

// type CardsResponseRequest struct {
// 	PayLoad   []*mtg.Card `json:"payLoad"`
// 	ReturnMsg string      `json:"returnMsg"`
// 	Error     string      `json:"errorMsg"`
// }

// type CardResponseRequest struct {
// 	PayLoad   *mtg.Card `json:"payLoad"`
// 	ReturnMsg string    `json:"returnMsg"`
// 	Error     string    `json:"errorMsg"`
// }

// initLogging initializes logging settings
func initLogging(traceH io.Writer, infoH io.Writer, warnH io.Writer, errorH io.Writer) {

	logTrace = log.New(traceH,
		"DEBUG: ",
		log.Ldate|log.Ltime|log.Lshortfile)

	logInfo = log.New(infoH,
		"INFO: ",
		log.Ldate|log.Ltime|log.Lshortfile)

	logWarning = log.New(warnH,
		"WARNING: ",
		log.Ldate|log.Ltime|log.Lshortfile)

	logError = log.New(errorH,
		"ERROR: ",
		log.Ldate|log.Ltime|log.Lshortfile)
}

var mySigningKey = []byte("secret")

var AuthHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return mySigningKey, nil
	})

	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username)
		user.GetCollection()
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	rsp := ResponseRequest{user, "", ""}
	json.NewEncoder(w).Encode(rsp)
})

func getToken(username string) string {
	/* Create the token */
	token := jwt.New(jwt.SigningMethodHS256)

	// Create a map to store our claims
	claims := token.Claims.(jwt.MapClaims)

	/* Set token claims */
	claims["admin"] = false
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()

	/* Sign the token with our secret */
	tokenString, _ := token.SignedString(mySigningKey)

	return tokenString
}

var SetsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	sets, err := mtg.NewSetQuery().All()
	if err != nil {
		log.Panic(err)
	}

	// for _, set := range sets {
	// 	log.Println(set)
	// }

	rsp := ResponseRequest{sets, "Fetch eseguita.", ""}
	json.NewEncoder(w).Encode(rsp)
})

var CardsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	log.Println(r.URL.Query())
	qp := r.URL.Query()

	cards, err := mtg.NewQuery().
		Where(mtg.CardSet, qp.Get("setCode")).
		Where(mtg.CardName, qp.Get("name")).
		All()

	if err != nil {
		log.Panic(err)
	}

	rsp := ResponseRequest{cards, "Fetch eseguita.", ""}
	json.NewEncoder(w).Encode(rsp)
})

var CardDetailHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	vars := mux.Vars(r)

	log.Println(vars)
	mId, err := strconv.Atoi(vars["id"])
	// qp := r.URL.Query()

	card, err := mtg.MultiverseId(mId).Fetch()

	if err != nil {
		log.Panic(err)
	}

	rsp := ResponseRequest{card, "Fetch eseguita.", ""}
	json.NewEncoder(w).Encode(rsp)
})

var LoginHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	userAccess := Credentials{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&userAccess)

	logTrace.Println("Begin authentication")

	if err != nil {
		logError.Print("Failed to convert JSON data to struct")
		logError.Printf("%v", err)
	}

	logTrace.Printf("User with name %s is trying to authenticate", userAccess.Username)
	logTrace.Printf("%+v\n", userAccess)

	user := auth.User{}
	isAuthenticated := user.CheckCredentials(userAccess.Username, userAccess.Password)
	logTrace.Printf("User %s Authentication is %t", user.Name, isAuthenticated)

	if isAuthenticated {
		user.Token = getToken(user.Username)
		user.Password = ""
		user.GetCollection()
		// result, err := json.Marshal(user)
		if err != nil {
			panic(err)
		}
		// payload, _ := strconv.Unquote(string(result))
		rsp := ResponseRequest{user, "Autenticazione effettuata.", ""}
		// rsp := ResponseRequest{string(result), "Autenticazione effettuata.", ""}
		// w.Write(result)
		json.NewEncoder(w).Encode(rsp)
		return
	}

	rsp := ResponseRequest{auth.User{}, "Le credenziali risultano non valide", "Autenticazione fallita."}
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(rsp)
})

var AddCollHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	cardColl := collection.OwnedCard{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&cardColl)

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return mySigningKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username)
		user.GetCollection()
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	logTrace.Printf("Adding card %v to collection of user %s", cardColl, user.Id)
	user.Collection = collection.AddCard(user.Id, cardColl)

	rsp := ResponseRequest{user, "Carta Aggiunta", ""}
	json.NewEncoder(w).Encode(rsp)

})

var RemCollHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	cardColl := collection.OwnedCard{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&cardColl)

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return mySigningKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username)
		user.GetCollection()
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	logTrace.Printf("Removing card %v to collection of user %s", cardColl, user.Id)
	user.Collection = collection.RemoveCard(user.Id, cardColl)

	rsp := ResponseRequest{user, "Carta rimossa", ""}
	json.NewEncoder(w).Encode(rsp)

})

var TransCollHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return mySigningKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username)
		user.GetCollection()
		// fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	transList := collection.RetrieveCardTransactions(user.Id)

	fmt.Print(transList)
	rsp := ResponseRequest{transList, "", ""}
	json.NewEncoder(w).Encode(rsp)
})

var jwtMiddleware = jwtmiddleware.New(jwtmiddleware.Options{
	ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
		return mySigningKey, nil
	},
	SigningMethod: jwt.SigningMethodHS256,
})

func init() {
	flag.StringVar(&port, "p", ":9000", "listening port for MTGOrganizer")
	flag.BoolVar(&debug, "d", false, "activate debug mode.(default false)")
	flag.StringVar(&logPath, "logdir", "", "setting the log directory")
}

func main() {
	// Retrieving the parameters of the GO service
	flag.Parse()

	// checking if the destination path of the log is set.
	if logPath == "" {
		fmt.Fprintln(os.Stderr, "Log directory not set.")
		os.Exit(1)
	}

	// initializing logger
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0664)
	if err != nil {
		log.Fatalf("Unable to open log %v : %v", logPath, err.Error())
	}
	defer logFile.Close()

	multiWr := io.MultiWriter(logFile, os.Stdout)

	initLogging(multiWr, multiWr, multiWr, multiWr)

	// checking if debug mode is activated
	if debug {
		fmt.Println("starting in debug mode")
		logTrace.Println("starting in debug mode")
	}

	// starting the server
	r := mux.NewRouter().StrictSlash(true)

	// setting CORS
	headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// adding auth service
	// r.Handle("/get-token", GetTokenHandler).Methods("GET")
	r.Handle("/auth", jwtMiddleware.Handler(AuthHandler)).Methods("GET")
	r.Handle("/login", LoginHandler).Methods("POST")
	r.Handle("/userInfo", jwtMiddleware.Handler(AuthHandler)).Methods("GET")
	// r.Handle("/collection", jwtMiddleware.Handler(CollHandler)).Methods("GET")
	r.Handle("/sets", SetsHandler).Methods("GET")
	r.Path("/cards").
		Queries("name", "{name}", "setCode", "{setCode}").
		HandlerFunc(CardsHandler).
		Methods("GET")
	r.HandleFunc("/card/{id}", CardDetailHandler).Methods("GET")
	r.Handle("/collection/add", jwtMiddleware.Handler(AddCollHandler)).Methods("POST")
	r.Handle("/collection/remove", jwtMiddleware.Handler(RemCollHandler)).Methods("POST")
	r.Handle("/collection/transactions", jwtMiddleware.Handler(TransCollHandler)).
		Methods("GET")
	// adding business services, for now we have nothing

	logInfo.Println(http.ListenAndServe(port, handlers.CORS(originsOk, headersOk, methodsOk)(r)))

}
