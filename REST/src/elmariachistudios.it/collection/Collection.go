package collection

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"

	"elmariachistudios.it/transaction"
	mtg "github.com/MagicTheGathering/mtg-sdk-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/patrickmn/go-cache"
)

const (
	plainInsert          = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?)"
	updateInsert         = "INSERT INTO mtg_collection(id_owner,id_card,c_name,c_names,c_rarity,c_collnum,id_lang,c_language,mtg_set,quantity,foil,foil_quantity,id_binder) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, foil_quantity=?"
	selectByUser         = "SELECT id_card,c_name,c_names,c_rarity,c_collnum,id_lang,c_language,mtg_set,quantity,foil,foil_quantity,id_binder from mtg_collection WHERE id_owner = ?"
	selectByUserCard     = "SELECT id_card,mtg_set,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ? AND id_card = ?"
	deleteByUserCard     = "DELETE FROM mtg_collection WHERE id_owner=? AND id_card=? AND id_lang=?"
	retrieveBinderByUser = "SELECT id_binder, id_owner, binder_name, creation_date FROM mtg_binder WHERE id_owner= ?"
	addBinder            = "INSERT INTO mtg_binder (id_owner, binder_name, creation_date) VALUES(?,?,?)"
	transAdded           = "INSERT INTO mtg_card_transaction (u_id,c_id,c_name,c_names,c_set,c_collnum,c_lang,id_lang,c_type,trans_type,trans_date) VALUES(?,?,?,?,?,?,?,?,?,'add',?)"
	transRemoved         = "INSERT INTO mtg_card_transaction (u_id,c_id,c_name,c_names,c_set,c_collnum,c_lang,id_lang,c_type,trans_type,trans_date) VALUES(?,?,?,?,?,?,?,?,?,'remove',?)"
	plainWishInsert      = "INSERT INTO mtg_card_wishlist (u_id,c_id,c_name,c_set,c_type,quantity) VALUES(?,?,?,?,?,?)"
	updateWishInsert     = "INSERT INTO mtg_card_wishlist VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, c_set=?"
	DBAuth               = "tolagenda:S8s8m3n3f8!@tcp(localhost:3306)/MTGOrganizer?parseTime=true"
)

// declaring cache
var data storedData

type storedData struct {
	priceCache *cache.Cache
}

type MTGCard struct {
	CardInfo  *mtg.Card `json:"cardInfo"`
	CardPrice CardPrice `json:"cardPricings"`
}

type OwnedCard struct {
	IdCard       string   `json:"id_card"`
	CardName     string   `json:"card_name"`
	CardNames    []string `json:"card_names"`
	Rarity       string   `json:"rarity"`
	CollNum      string   `json:"collection_number"`
	Language     string   `json:"language"`
	IdLang       string   `json:"id_lang"`
	Quantity     int      `json:"quantity"`
	IdSet        string   `json:"mtg_set"`
	Foil         bool     `json:"foil"`
	FoilQuantity int      `json:"foil_quantity"`
	Binder       int      `json:"id_binder"`
}

type Binder struct {
	IdBinder int       `json:"binderId"`
	IdUser   int       `json:"userId"`
	Name     string    `json:"binderName"`
	DCreate  time.Time `json:"creationDate"`
}

type CardTransaction struct {
	RId       int       `json:"rowId"`
	IdUser    int       `json:"userId"`
	IdCard    int       `json:"cardId"`
	CardName  string    `json:"name"`
	CardNames []string  `json:"names"`
	CardSet   string    `json:"cardSet"`
	CollNum   string    `json:"collection_number"`
	Language  string    `json:"language"`
	IdLang    string    `json:"id_lang"`
	CardType  int       `json:"cardType"`
	Type      string    `json:"transType"`
	DTtrans   time.Time `json:"transDate"`
	//	CardInfo *mtg.Card `json:"cardInfo"`
}

type CardWishlist struct {
	RId       string   `json:"rowId"`
	IdCard    int      `json:"cardId"`
	CardType  int      `json:"cardType"`
	CardName  string   `json:"name"`
	CardNames []string `json:"names"`
	CardSet   string   `json:"cardSet"`
	Quantity  int      `json:"quantity"`
}

type CardPrice struct {
	CId          string    `json:"cardId"`
	NormalPrices []Pricing `json:"pricesNormal"`
	FoilPrices   []Pricing `json:"pricesFoil"`
}

type Pricing struct {
	Date  time.Time `json:"date"`
	Value float64   `json:"value"`
}

func init() {
	// setting up the cache collector
	data.priceCache = cache.New(cache.NoExpiration, 0*time.Minute)
	readFromJson("../JSON/ReducedAllPrices.json", data.priceCache)

	log.Println("runtime cache generata!")
	log.Printf("Dimensione della cache: %v elementi trovati. \n", data.priceCache.ItemCount())
}

func readFromJson(pathToJson string, c *cache.Cache) (bool, error) {
	// Open our jsonFile
	jsonFile, err := os.Open(pathToJson)

	// if we os.Open returns an error then handle it
	if err != nil {
		log.Fatalf("failed to open the pricings json file: %v", err)
		return false, err
		// fmt.Println(err)
	}

	log.Println("Successfully opened pricings json file")
	// read our opened jsonFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var pricings []CardPrice
	json.Unmarshal(byteValue, &pricings)

	// fmt.Printf("%+v", pricings)
	for _, price := range pricings {
		if price.CId == "4732deef-6d46-54c3-86be-fd081d780893" {
			fmt.Println("Inserita in cache la quotazione della carta con id 4732deef-6d46-54c3-86be-fd081d780893")
		}
		c.Set(price.CId, price, cache.NoExpiration)
		// fmt.Printf("%+v \n", price)
	}

	log.Println("Successfully loaded pricings in cache")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()
	return true, nil
}

func mergeNames(card *mtg.Card) string {
	var cnames string
	if card.Names != nil {
		return strings.Join(card.Names, "_")
	}
	return cnames
}

func (cp *CardPrice) UnmarshalJSON(data []byte) error {
	mp := map[string]interface{}{}
	var np = []Pricing{}
	var fp = []Pricing{}

	if err := json.Unmarshal(data, &mp); err != nil {
		return err
	}

	cp.CId = mp["cardId"].(string)
	delete(mp, "cardId")

	if val, ok := mp["normalPrices"]; ok && val != nil {
		for k, v := range mp["normalPrices"].(map[string]interface{}) {
			//u := map[string]interface{}{strings.TrimPrefix(string(k), "_"): v}
			var p Pricing
			mydate, _ := time.Parse("2006-01-02", k)
			p.Date = mydate
			p.Value = v.(float64)
			np = append(np, p)
		}
	}

	if val, ok := mp["foilPrices"]; ok && val != nil {
		for k, v := range mp["foilPrices"].(map[string]interface{}) {
			//u := map[string]interface{}{strings.TrimPrefix(string(k), "_"): v}
			var p Pricing
			mydate, _ := time.Parse("2006-01-02", k)
			p.Date = mydate
			p.Value = v.(float64)
			fp = append(fp, p)
		}
	}

	cp.NormalPrices = np
	cp.FoilPrices = fp

	return nil
}

/* func mergeNames(card *mtg.Card) (string,bool){
	if card.Names != nil {
		return strings.Join(card.Names,"_"), false
	}
	return cnames string,true
} */

func GetPrice(card *mtg.Card) MTGCard {
	var mc MTGCard
	mc.CardInfo = card

	id := string(card.Id)
	fmt.Printf("Cerco la carta con id %v in una cache di %v elementi. \n", id, data.priceCache.ItemCount())

	value, found := data.priceCache.Get(id)

	if !found {
		fmt.Println("qualcosa non va nella cache")
	}

	if found {
		fmt.Printf("cache ok %v", value)
	}
	cp, ok := value.(CardPrice)

	if ok {
		mc.CardPrice = cp
	}

	fmt.Printf("%+v \n", mc)

	return mc
	// fmt.Printf("%+v \n", value)
}

func RetrieveCardTransactions(userId int) []CardTransaction {
	var cts = []CardTransaction{}

	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return cts
	}

	fmt.Println(userId)
	results, err := db.Query("SELECT r_id,u_id,c_id,c_name,c_names,c_set,c_type,trans_type,trans_date from mtg_card_transaction WHERE u_id = ? ORDER BY trans_date DESC LIMIT 10", userId)

	fmt.Println("recuperato i risultati della query")

	if err != nil {
		fmt.Print(err)
		fmt.Println(" ho un errore nella query")
		return cts
	}

	for results.Next() {
		var ct CardTransaction
		var cardNames sql.NullString
		err = results.Scan(&ct.RId, &ct.IdUser, &ct.IdCard, &ct.CardName, &cardNames, &ct.CardSet, &ct.CardType, &ct.Type, &ct.DTtrans)

		fmt.Print(err)
		if err != nil {
			fmt.Print("sono dentro il check di errore!")
			return []CardTransaction{}
		}

		if cardNames.Valid {
			ct.CardNames = strings.Split(cardNames.String, "_")
		}
		// ct.CardInfo, err = mtg.MultiverseId(ct.IdCard).Fetch()
		// fmt.Println("appending transaction to array")
		cts = append(cts, ct)
		// fmt.Printf("%+v", ct)
	}

	// fmt.Print(cts)
	return cts
}

func RetrieveWishlist(userId int) []CardWishlist {
	var wl = []CardWishlist{}

	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return wl
	}

	results, err := db.Query("SELECT r_id,c_id,c_name,c_names,c_set,c_type,quantity FROM mtg_card_wishlist WHERE u_id= ?", userId)

	if err != nil {
		fmt.Print(err)
		fmt.Println(" ho un errore nella query")
		return wl
	}

	for results.Next() {
		var cwl CardWishlist
		var cardNames sql.NullString
		err = results.Scan(&cwl.RId, &cwl.IdCard, &cwl.CardName, &cardNames, &cwl.CardSet, &cwl.CardType, &cwl.Quantity)

		if err != nil {
			fmt.Print("errore nello scan!")
			return []CardWishlist{}
		}

		if cardNames.Valid {
			cwl.CardNames = strings.Split(cardNames.String, "_")
		}

		wl = append(wl, cwl)
	}

	return wl
}

func UpdateWishlist(userId int, cardWish CardWishlist) []CardWishlist {
	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return []CardWishlist{}
	}

	// recupero(se esiste) la tupla della carta da inserire in wishlist da DB
	var cwl CardWishlist
	err = db.QueryRow("SELECT r_id,c_id,c_name,c_set,c_type,quantity FROM mtg_card_wishlist WHERE u_id = ? AND c_id = ? AND c_type = ?", userId, cardWish.IdCard, cardWish.CardType).
		Scan(&cwl.RId, &cwl.IdCard, &cwl.CardName, &cwl.CardSet, &cwl.CardType, &cwl.Quantity)

	if err != nil && err != sql.ErrNoRows {
		panic(err)
	}

	if err == sql.ErrNoRows {
		if cardWish.Quantity == 0 {
			return RetrieveWishlist(userId)
		} else {
			_, errQ := db.Query(plainWishInsert, userId, cardWish.IdCard, cardWish.CardName, cardWish.CardSet, cardWish.CardType, cardWish.Quantity)

			if errQ != nil {
				panic(errQ)
			}
		}
	} else {
		_, errQ := db.Query(updateWishInsert, cwl.RId, userId, cardWish.IdCard, cardWish.CardName, cardWish.CardSet, cardWish.CardType, cardWish.Quantity, cardWish.Quantity, cardWish.CardSet)

		if errQ != nil {
			panic(errQ)
		}
	}
	return RetrieveWishlist(userId)
}

func RetrieveList(userId int) []OwnedCard {
	var collection = []OwnedCard{}

	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return collection
	}

	results, err := db.Query(selectByUser, userId)

	if err != nil {
		return collection
	}

	// "SELECT id_card,c_name,c_names,c_rarity,c_collnum,id_language,c_language,mtg_set,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ?"
	for results.Next() {
		var oc OwnedCard
		var cardNames sql.NullString
		err = results.Scan(&oc.IdCard, &oc.CardName, &cardNames, &oc.Rarity, &oc.CollNum, &oc.IdLang, &oc.Language, &oc.IdSet, &oc.Quantity, &oc.Foil, &oc.FoilQuantity, &oc.Binder)

		if err != nil {
			// return []OwnedCard{}
			panic(err)
		}

		if cardNames.Valid {
			oc.CardNames = strings.Split(cardNames.String, "_")
		}

		// fmt.Printf("%+v", oc)
		collection = append(collection, oc)
	}

	// fmt.Println(collection)
	return collection
}

func RetrieveBindersList(userId int) []Binder {
	var bs = []Binder{}

	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return bs
	}

	results, errL := db.Query(retrieveBinderByUser, userId)
	if errL != nil {
		panic(errL)
	}

	for results.Next() {
		var b Binder
		err = results.Scan(&b.IdBinder, &b.IdUser, &b.Name, &b.DCreate)

		if err != nil {
			// return []OwnedCard{}
			panic(err)
		}

		// fmt.Printf("%+v", oc)
		bs = append(bs, b)
	}

	// fmt.Println(collection)
	return bs
}

func AddBinder(userId int, binderName string) []Binder {
	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return []Binder{}
	}

	// recupero il momento della richiesta di nuovo album
	const createdFormat = "2006-01-02 15:04:05"
	actualTime := time.Now().Format(createdFormat)

	_, errQ := db.Query(addBinder, userId, binderName, actualTime)

	if errQ != nil {
		panic(errQ)
	}

	// la insert è andata ok, recupero tutti gli album dell'utente
	results, errL := db.Query(retrieveBinderByUser, userId)
	if errL != nil {
		panic(errL)
	}

	var bs = []Binder{}

	for results.Next() {
		var b Binder
		err = results.Scan(&b.IdBinder, &b.IdUser, &b.Name, &b.DCreate)

		if err != nil {
			// return []OwnedCard{}
			panic(err)
		}

		// fmt.Printf("%+v", oc)
		bs = append(bs, b)
	}

	// fmt.Println(collection)
	return bs
}

func UpdateCard(userId int, cardColl OwnedCard) []OwnedCard {
	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return []OwnedCard{}
	}

	// recupero idpadre
	multiverseId := strings.Split(cardColl.IdCard, "_")

	// recupero(se esiste) la tupla della carta da inserire in collezione da DB
	var oc OwnedCard
	err = db.QueryRow(selectByUserCard, userId, cardColl.IdCard).
		Scan(&oc.IdCard, &oc.IdSet, &oc.Quantity, &oc.Foil, &oc.FoilQuantity)

	if err != nil && err != sql.ErrNoRows {
		panic(err)
	}

	// recupero le info della carta da aggiungere dalle api di mtg
	cInfo, errMQ := mtg.CardId(multiverseId[0]).Fetch()

	if errMQ != nil {
		panic(errMQ)
	}

	/* cnames,hasErr := mergeNames(cInfo)
	if hasErr {
		var cnames string
	} */
	// preparo gli statements della transazione SQL
	stmts := []*transaction.PipelineStmt{}

	// recupero il momento della richiesta di update della collezione
	const createdFormat = "2006-01-02 15:04:05"
	actualTime := time.Now().Format(createdFormat)

	// se non ho gia righe esistenti vuol dire che la carta non e presente in collezione
	if err == sql.ErrNoRows {
		if cardColl.Quantity == 0 && cardColl.FoilQuantity == 0 {
			return RetrieveList(userId)
		} else {
			// altrimenti insert o update
			// updateInsert         = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, foil_quantity=?"
			stmts = append(stmts, transaction.NewPipelineStmt(
				updateInsert,
				userId,
				cardColl.IdCard,
				cInfo.Name,
				mergeNames(cInfo),
				cInfo.Rarity,
				cInfo.Number,
				cardColl.IdLang,
				cardColl.Language,
				cardColl.IdSet,
				cardColl.Quantity,
				cardColl.Foil,
				cardColl.FoilQuantity,
				cardColl.Binder,
				cardColl.Quantity,
				cardColl.FoilQuantity,
			))
		}
		stmts = append(stmts, transaction.NewPipelineStmt(
			transAdded,
			userId,
			cardColl.IdCard,
			cInfo.Name,
			mergeNames(cInfo),
			cInfo.Set,
			cInfo.Number,
			cardColl.Language,
			cardColl.IdLang,
			false,
			actualTime,
		))
	}

	// se invece ho righe esistenti devo verificare se si tratta di aggiunte o rimozioni
	if err == nil {
		// se sia la quantita normale che quella foil sono a 0 allora devo rimuovere la tupla
		// deleteByUserCard     = "DELETE FROM mtg_collection WHERE id_owner=? AND id_card=? AND id_lang=?"
		if cardColl.Quantity == 0 && cardColl.FoilQuantity == 0 {
			stmts = append(stmts, transaction.NewPipelineStmt(deleteByUserCard, userId, cardColl.IdCard, cardColl.IdLang))
		} else {
			// altrimenti insert o update
			// updateInsert     = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, foil_quantity=?"
			stmts = append(stmts, transaction.NewPipelineStmt(
				updateInsert,
				userId,
				cardColl.IdCard,
				cInfo.Name,
				mergeNames(cInfo),
				cInfo.Rarity,
				cInfo.Number,
				cardColl.IdLang,
				cardColl.Language,
				cardColl.IdSet,
				cardColl.Quantity,
				cardColl.Foil,
				cardColl.FoilQuantity,
				cardColl.Binder,
				cardColl.Quantity,
				cardColl.FoilQuantity,
			))
		}
		//confronto le due quantità di carte normali
		if cardColl.Quantity > oc.Quantity {
			// transAdded           = "INSERT INTO mtg_card_transaction (u_id,c_id,c_name,c_names,c_set,c_collnum,c_lang,id_lang,c_type,trans_type,trans_date) VALUES(?,?,?,?,?,?,?,?,?,'add',?)"
			stmts = append(stmts, transaction.NewPipelineStmt(
				transAdded,
				userId,
				cardColl.IdCard,
				cInfo.Name,
				mergeNames(cInfo),
				cInfo.Set,
				cInfo.Number,
				cardColl.Language,
				cardColl.IdLang,
				false,
				actualTime,
			))
		}
		if cardColl.Quantity < oc.Quantity {
			stmts = append(stmts, transaction.NewPipelineStmt(
				transRemoved,
				userId,
				cardColl.IdCard,
				cInfo.Name,
				mergeNames(cInfo),
				cInfo.Set,
				cInfo.Number,
				cardColl.Language,
				cardColl.IdLang,
				false,
				actualTime,
			))
		}

		if cardColl.FoilQuantity > oc.FoilQuantity {
			stmts = append(stmts, transaction.NewPipelineStmt(
				transAdded,
				userId,
				cardColl.IdCard,
				cInfo.Name,
				mergeNames(cInfo),
				cInfo.Set,
				cInfo.Number,
				cardColl.Language,
				cardColl.IdLang,
				true,
				actualTime,
			))
		}
		if cardColl.FoilQuantity < oc.FoilQuantity {
			stmts = append(stmts, transaction.NewPipelineStmt(
				transRemoved,
				userId,
				cardColl.IdCard,
				cInfo.Name,
				mergeNames(cInfo),
				cInfo.Set,
				cInfo.Number,
				cardColl.Language,
				cardColl.IdLang,
				true,
				actualTime,
			))

		}
	}

	errTX := transaction.WithTransaction(db, func(tx transaction.Transaction) error {
		_, err := transaction.RunPipeline(tx, stmts...)
		return err
	})

	if errTX != nil {
		panic(errTX)
	}

	return RetrieveList(userId)

}

func RemoveCard(userId int, cardColl OwnedCard) []OwnedCard {
	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return []OwnedCard{}
	}

	actualTime := time.Now().Format(time.RFC3339)

	var stmts []*transaction.PipelineStmt
	// preparo gli statements in base alla quantità della carta da rimuovere
	// se risulta zero va rimossa dalla collezione
	if cardColl.Quantity == 0 {
		stmts = []*transaction.PipelineStmt{
			transaction.NewPipelineStmt(
				deleteByUserCard,
				userId, cardColl.IdCard),
			transaction.NewPipelineStmt(
				"INSERT INTO mtg_card_transaction (u_id,c_id,trans_type,trans_date) VALUES(?,?,'remove',?)",
				userId, cardColl.IdCard, actualTime),
		}
	} else { // altrimenti faccio update
		stmts = []*transaction.PipelineStmt{
			transaction.NewPipelineStmt(
				updateInsert,
				userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Foil, cardColl.FoilQuantity, cardColl.Quantity, cardColl.FoilQuantity),
			transaction.NewPipelineStmt(
				"INSERT INTO mtg_card_transaction (u_id,c_id,trans_type,trans_date) VALUES(?,?,'remove',?)",
				userId, cardColl.IdCard, actualTime),
		}
	}

	err = transaction.WithTransaction(db, func(tx transaction.Transaction) error {
		_, err := transaction.RunPipeline(tx, stmts...)
		return err
	})

	if err != nil {
		panic(err)
	}

	return RetrieveList(userId)

}
