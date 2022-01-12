package collection

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"elmariachistudios.it/transaction"
	"github.com/MagicTheGathering/mtg-sdk-go"
	_ "github.com/go-sql-driver/mysql"
)

const (
	plainInsert      = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?)"
	updateInsert     = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, foil_quantity= ?"
	selectByUser     = "SELECT id_card,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ?"
	selectByUserCard = "SELECT id_card,mtg_set,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ? AND id_card = ?"
	deleteByUserCard = "DELETE FROM mtg_collection WHERE id_owner=? AND id_card=?"
	transAdded       = "INSERT INTO mtg_card_transaction (u_id,c_id,c_name,c_names,c_set,c_type,trans_type,trans_date) VALUES(?,?,?,?,?,?,'add',?)"
	transRemoved     = "INSERT INTO mtg_card_transaction (u_id,c_id,c_name,c_names,c_set,c_type,trans_type,trans_date) VALUES(?,?,?,?,?,?,'remove',?)"
	plainWishInsert  = "INSERT INTO mtg_card_wishlist (u_id,c_id,c_name,c_set,c_type,quantity) VALUES(?,?,?,?,?,?)"
	updateWishInsert = "INSERT INTO mtg_card_wishlist VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, c_set=?"
	DBAuth           = "tolagenda:S8s8m3n3f8!@tcp(localhost:3306)/MTGOrganizer?parseTime=true"
)

type OwnedCard struct {
	IdCard       string `json:"id_card"`
	Quantity     int    `json:"quantity"`
	IdSet        string `json:"mtg_set"`
	Foil         bool   `json:"foil"`
	FoilQuantity int    `json:"foil_quantity"`
}

type CardTransaction struct {
	RId       int       `json:"rowId"`
	IdUser    int       `json:"userId"`
	IdCard    int       `json:"cardId"`
	CardName  string    `json:"name"`
	CardNames []string  `json:"names"`
	CardSet   string    `json:"cardSet"`
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

func mergeNames(card *mtg.Card) string {
	var cnames string
	if card.Names != nil {
		return strings.Join(card.Names, "_")
	}
	return cnames
}

/* func mergeNames(card *mtg.Card) (string,bool){
	if card.Names != nil {
		return strings.Join(card.Names,"_"), false
	}
	return cnames string,true
} */

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

	for results.Next() {
		var oc OwnedCard
		err = results.Scan(&oc.IdCard, &oc.Quantity, &oc.Foil, &oc.FoilQuantity)

		if err != nil {
			return []OwnedCard{}
		}
		// fmt.Printf("%+v", oc)
		collection = append(collection, oc)
	}

	// fmt.Print(collection)
	return collection
}

func UpdateCard(userId int, cardColl OwnedCard) []OwnedCard {
	db, err := sql.Open("mysql", DBAuth)

	defer db.Close()

	if err != nil {
		return []OwnedCard{}
	}

	// recupero(se esiste) la tupla della carta da inserire in collezione da DB
	var oc OwnedCard
	err = db.QueryRow(selectByUserCard, userId, cardColl.IdCard).
		Scan(&oc.IdCard, &oc.IdSet, &oc.Quantity, &oc.Foil, &oc.FoilQuantity)

	if err != nil && err != sql.ErrNoRows {
		panic(err)
	}

	// recupero le info della carta da aggiungere dalle api di mtg
	cInfo, errMQ := mtg.CardId(cardColl.IdCard).Fetch()

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
			stmts = append(stmts, transaction.NewPipelineStmt(updateInsert, userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Foil, cardColl.FoilQuantity, cardColl.Quantity, cardColl.FoilQuantity))
		}
		stmts = append(stmts, transaction.NewPipelineStmt(transAdded, userId, cardColl.IdCard, cInfo.Name, mergeNames(cInfo), cInfo.Set, cardColl.Foil, actualTime))
	}

	// se invece ho righe esistenti devo verificare se si tratta di aggiunte o rimozioni
	if err == nil {
		// se sia la quantita normale che quella foil sono a 0 allora devo rimuovere la tupla
		if cardColl.Quantity == 0 && cardColl.FoilQuantity == 0 {
			stmts = append(stmts, transaction.NewPipelineStmt(deleteByUserCard, userId, cardColl.IdCard))
		} else {
			// altrimenti insert o update
			stmts = append(stmts, transaction.NewPipelineStmt(updateInsert, userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Foil, cardColl.FoilQuantity, cardColl.Quantity, cardColl.FoilQuantity))
		}
		//confronto le due quantità di carte normali
		if cardColl.Quantity > oc.Quantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transAdded, userId, cardColl.IdCard, cInfo.Name, mergeNames(cInfo), cInfo.Set, false, actualTime))
		}
		if cardColl.Quantity < oc.Quantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transRemoved, userId, cardColl.IdCard, cInfo.Name, mergeNames(cInfo), cInfo.Set, false, actualTime))
		}

		if cardColl.FoilQuantity > oc.FoilQuantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transAdded, userId, cardColl.IdCard, cInfo.Name, mergeNames(cInfo), cInfo.Set, true, actualTime))

		}
		if cardColl.FoilQuantity < oc.FoilQuantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transRemoved, userId, cardColl.IdCard, cInfo.Name, mergeNames(cInfo), cInfo.Set, true, actualTime))

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
