package collection

import (
	"database/sql"
	"elmariachistudios.it/transaction"
	"fmt"
	"github.com/MagicTheGathering/mtg-sdk-go"
	_ "github.com/go-sql-driver/mysql"
	"time"
)

const (
	plainInsert      = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?)"
	updateInsert     = "INSERT INTO mtg_collection VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity=?, foil_quantity= ?"
	selectByUser     = "SELECT id_card,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ?"
	selectByUserCard = "SELECT id_card,mtg_set,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ? AND id_card = ?"
	deleteByUserCard = "DELETE FROM mtg_collection WHERE id_owner=? AND id_card=?"
	transAdded       = "INSERT INTO mtg_card_transaction (u_id,c_id,c_type,trans_type,trans_date) VALUES(?,?,?,'add',?)"
	transRemoved     = "INSERT INTO mtg_card_transaction (u_id,c_id,c_type,trans_type,trans_date) VALUES(?,?,?,'remove',?)"
)

type OwnedCard struct {
	IdCard       int    `json:"id_card"`
	Quantity     int    `json:"quantity"`
	IdSet        string `json:"mtg_set"`
	Foil         bool   `json:"foil"`
	FoilQuantity int    `json:"foil_quantity"`
}

type CardTransaction struct {
	RId      int       `json:"r_id"`
	IdUser   int       `json:"u_id"`
	IdCard   int       `json:"c_id"`
	CardType int       `json:"c_type"`
	Type     string    `json:"trans_type"`
	DTtrans  time.Time `json:"trans_date"`
	CardInfo *mtg.Card `json:"cardInfo"`
}

func RetrieveCardTransactions(userId int) []CardTransaction {
	var cts = []CardTransaction{}

	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer?parseTime=true")

	defer db.Close()

	if err != nil {
		return cts
	}

	fmt.Println(userId)
	results, err := db.Query("SELECT r_id,u_id,c_id,c_type,trans_type,trans_date from mtg_card_transaction WHERE u_id = ?", userId)

	fmt.Println("recuperato i risultati della query")

	if err != nil {
		fmt.Print(err)
		fmt.Println(" ho un errore nella query")
		return cts
	}

	for results.Next() {
		var ct CardTransaction
		err = results.Scan(&ct.RId, &ct.IdUser, &ct.IdCard, &ct.CardType, &ct.Type, &ct.DTtrans)

		fmt.Print(err)
		if err != nil {
			fmt.Print("sono dentro il check di errore!")
			return []CardTransaction{}
		}
		ct.CardInfo, err = mtg.MultiverseId(ct.IdCard).Fetch()
		// fmt.Println("appending transaction to array")
		cts = append(cts, ct)
		// fmt.Printf("%+v", ct)
	}

	// fmt.Print(cts)
	return cts
}

func RetrieveList(userId int) []OwnedCard {
	var collection = []OwnedCard{}

	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

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
	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

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

	// preparo gli statements della transazione SQL
	stmts := []*transaction.PipelineStmt{}

	// recupero il momento della richiesta di update della collezione
	actualTime := time.Now().Format(time.RFC3339)

	// se non ho gia righe esistenti vuol dire che la carta non e presente in collezione
	if err == sql.ErrNoRows {
		if cardColl.Quantity == 0 && cardColl.FoilQuantity == 0 {
			return RetrieveList(userId)
		} else {
			// altrimenti insert o update
			stmts = append(stmts, transaction.NewPipelineStmt(updateInsert, userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Foil, cardColl.FoilQuantity, cardColl.Quantity, cardColl.FoilQuantity))
		}
		stmts = append(stmts, transaction.NewPipelineStmt(transAdded, userId, cardColl.IdCard, cardColl.Foil, actualTime))
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
			stmts = append(stmts, transaction.NewPipelineStmt(transAdded, userId, cardColl.IdCard, false, actualTime))
		}
		if cardColl.Quantity < oc.Quantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transRemoved, userId, cardColl.IdCard, false, actualTime))
		}

		if cardColl.FoilQuantity > oc.FoilQuantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transAdded, userId, cardColl.IdCard, true, actualTime))

		}
		if cardColl.FoilQuantity < oc.FoilQuantity {
			stmts = append(stmts, transaction.NewPipelineStmt(transRemoved, userId, cardColl.IdCard, true, actualTime))

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
	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

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
