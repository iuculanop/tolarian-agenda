package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"elmariachistudios.it/auth"
	"elmariachistudios.it/collection"
	mtg "github.com/MagicTheGathering/mtg-sdk-go"
	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	"github.com/auth0/go-jwt-middleware/validator"
	jwt "github.com/golang-jwt/jwt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
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

// CustomClaimsExample contains custom data we want from the token.
type MyCustomClaims struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	jwt.StandardClaims
}

// Validate does nothing for this example.
func (c *MyCustomClaims) Validate(ctx context.Context) error {
	if c.Username == "" {
		return errors.New("should reject was set to true")
	}
	return nil
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ResponseRequest struct {
	PayLoad   interface{} `json:"payLoad"`
	ReturnMsg string      `json:"returnMsg"`
	ErrorMsg  string      `json:"errorMsg"`
}

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

var signKey = []byte("mtgOrganizer")

var mySigningKey = func(ctx context.Context) (interface{}, error) {
	// Our token must be signed using this data.
	return signKey, nil
}

var AuthHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})

	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["username"], claims["name"])
		//fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		user.GetCollection()
		user.GetFriends()
		//fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	rsp := ResponseRequest{user, "", ""}
	json.NewEncoder(w).Encode(rsp)
})

func getToken(username string, name string, surname string) string {

	currentTime := time.Now().Unix()
	expireTime := currentTime + 7200

	// Create the Claims
	claims := MyCustomClaims{
		name + " " + surname,
		username,
		jwt.StandardClaims{
			ExpiresAt: expireTime,
			Issuer:    "MTGOrganizer",
			Audience:  "tolagenda-webapp",
			IssuedAt:  currentTime,
			Subject:   "1234567890",
		},
	}

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	/* Sign the token with our secret */
	tokenString, _ := token.SignedString(signKey)

	// fmt.Printf("%v %v", tokenString, err)

	return tokenString
}

var SetsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

	sets, err := mtg.NewSetQuery().All()
	if err != nil {
		log.Panic(err)
	}

	rsp := ResponseRequest{sets, "Fetch eseguita.", ""}
	json.NewEncoder(w).Encode(rsp)
})

var CardsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

	log.Println(r.URL.Query())
	qp := r.URL.Query()

	cards, err := mtg.NewQuery().
		Where(mtg.CardSet, qp.Get("setCode")).
		Where(mtg.CardName, qp.Get("name")).
		// TODO: PARE NON FUNZIONI PIU DA DISMETTERE SE CONFERMATO
		// OrderBy(mtg.CardNumber).
		All()

	if err != nil {
		log.Panic(err)
	}

	rsp := ResponseRequest{cards, "Fetch eseguita.", ""}
	json.NewEncoder(w).Encode(rsp)
})

var CardDetailHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

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
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

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
		user.Token = getToken(user.Username, user.Name, user.Surname)
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

var CollHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")
	// w.Header().Set("Access-Control-Allow-Credentials", "true")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		user.GetCollection()
		// fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	// collection := user.Collection

	rsp := ResponseRequest{user.Collection, "Recuperata la collezione", ""}
	json.NewEncoder(w).Encode(rsp)

})

var BinderHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")
	// w.Header().Set("Access-Control-Allow-Credentials", "true")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		user.GetCollection()
		// fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	binders := collection.RetrieveBindersList(user.Id)

	rsp := ResponseRequest{binders, "Binders retrieved!", ""}
	json.NewEncoder(w).Encode(rsp)

})

var AddBinderHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")
	// w.Header().Set("Access-Control-Allow-Credentials", "true")

	binder := collection.Binder{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&binder)

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		user.GetCollection()
		// fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	binders := collection.AddBinder(user.Id, binder.Name)

	rsp := ResponseRequest{binders, "New binder created!", ""}
	json.NewEncoder(w).Encode(rsp)

})

var UpdateCollHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

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
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		user.GetCollection()
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	logTrace.Printf("Adding card %v to collection of user %s", cardColl, user.Id)
	user.Collection = collection.UpdateCard(user.Id, cardColl)

	rsp := ResponseRequest{user.Collection, "Carta Aggiunta", ""}
	json.NewEncoder(w).Encode(rsp)

})

var RemCollHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

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
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
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
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		user.GetCollection()
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	transList := collection.RetrieveCardTransactions(user.Id)

	fmt.Print(transList)
	rsp := ResponseRequest{transList, "", ""}
	json.NewEncoder(w).Encode(rsp)
})

var WishListHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		// fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	wishList := collection.RetrieveWishlist(user.Id)

	// fmt.Print(transList)
	rsp := ResponseRequest{wishList, "", ""}
	json.NewEncoder(w).Encode(rsp)
})

var UpdateWLHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

	cardWish := collection.CardWishlist{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&cardWish)

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})
	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Printf("%+v", claims)
		user.GetInfo(claims["username"].(string))
		user.Password = ""
		user.Token = getToken(user.Username, user.Name, user.Surname)
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	wl := collection.UpdateWishlist(user.Id, cardWish)

	rsp := ResponseRequest{wl, "Carta Aggiunta", ""}
	json.NewEncoder(w).Encode(rsp)

})

var ViewProfileHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "http://iucanhome.it:3000")

	vars := mux.Vars(r)

	log.Println(vars)

	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Split(authHeader, "Bearer ")
	// fmt.Printf("%s", tokenString[1])

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return signKey, nil
	})

	user := auth.User{}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// TODO: implementare chiamata al db per recuperare info sull'utente richiesto.
		fmt.Printf("%+v", claims)
		// user.GetInfo(vars["id"])
		user.GetInfo("s.penati")
		user.Password = ""
		user.GetCollection()
		fmt.Printf("%+v", user)
	} else {
		fmt.Println(err)
	}

	rsp := ResponseRequest{user, "", ""}
	json.NewEncoder(w).Encode(rsp)
})

// var jwtMiddleware = jwtmiddleware.New(jwtmiddleware.Options{
// 	ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
// 		return mySigningKey, nil
// 	},
// 	SigningMethod: jwt.SigningMethodHS256,
// })

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

	// We want this struct to be filled in with
	// our custom claims from the token.
	customClaims := func() validator.CustomClaims {
		return &MyCustomClaims{}
	}

	// setting up jwt validator
	jwtvalidator, err := validator.New(
		mySigningKey,
		validator.HS256,
		"MTGOrganizer",
		[]string{"tolagenda-webapp"},
		validator.WithCustomClaims(customClaims),
	)
	if err != nil {
		log.Fatalf("failed to set up the validator: %v", err)
	}

	// setting up jwt middleware
	jwtMiddleware := jwtmiddleware.New(jwtvalidator.ValidateToken)

	// starting the server
	r := mux.NewRouter().StrictSlash(true)

	// setting CORS
	credentialsOk := handlers.AllowCredentials()
	headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"http://iucanhome.it:3000"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// adding auth service
	// r.Handle("/get-token", GetTokenHandler).Methods("GET")
	r.Handle("/auth", jwtMiddleware.CheckJWT(AuthHandler)).Methods("GET")
	r.Handle("/login", LoginHandler).Methods("POST")
	r.Handle("/userInfo", jwtMiddleware.CheckJWT(AuthHandler)).Methods("GET")
	r.Handle("/sets", SetsHandler).Methods("GET")
	r.Path("/card").
		Queries("name", "{name}", "setCode", "{setCode}").
		HandlerFunc(CardsHandler).
		Methods("GET")
	r.HandleFunc("/card/{id}", CardDetailHandler).Methods("GET")
	r.Handle("/collection", jwtMiddleware.CheckJWT(CollHandler)).Methods("GET")
	r.Handle("/collection/binders", jwtMiddleware.CheckJWT(BinderHandler)).Methods("GET")
	r.Handle("/collection/update", jwtMiddleware.CheckJWT(UpdateCollHandler)).Methods("POST")
	r.Handle("/collection/binders/add", jwtMiddleware.CheckJWT(AddBinderHandler)).Methods("POST")
	// r.Handle("/collection/remove", jwtMiddleware.Handler(RemCollHandler)).Methods("POST")
	r.Handle("/collection/transactions", jwtMiddleware.CheckJWT(TransCollHandler)).
		Methods("GET")
	r.Handle("/wishlist", jwtMiddleware.CheckJWT(WishListHandler)).Methods("GET")
	r.Handle("/wishlist/update", jwtMiddleware.CheckJWT(UpdateWLHandler)).Methods("POST")
	//	r.Handle("/profile/{id}", jwtMiddleware.Handler(ViewProfileHandler)).Methods("GET")
	r.Path("/profile/{id}").
		Handler(jwtMiddleware.CheckJWT(ViewProfileHandler)).
		Methods("GET")
	// adding business services, for now we have nothing

	logInfo.Println(http.ListenAndServe(port, handlers.CORS(credentialsOk, originsOk, headersOk, methodsOk)(r)))

}
