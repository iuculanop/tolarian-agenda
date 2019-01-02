package collection

import (
	"database/sql"
	"elmariachistudios.it/transaction"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"time"
)

type OwnedCard struct {
	IdCard       int    `json:"id_card"`
	Quantity     int    `json:"quantity"`
	IdSet        string `json:"mtg_set"`
	Foil         bool   `json:"foil"`
	FoilQuantity int    `json:"foil_quantity"`
}

type CardTransaction struct {
	RId     int       `json:"r_id"`
	IdUser  int       `json:"u_id"`
	IdCard  int       `json:"c_id"`
	Type    string    `json:"trans_type"`
	DTtrans time.Time `json:"trans_date"`
}

func RetrieveCardTransactions(userId int) []CardTransaction {
	var cts = []CardTransaction{}

	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer?parseTime=true")

	defer db.Close()

	if err != nil {
		return cts
	}

	fmt.Println(userId)
	results, err := db.Query("SELECT r_id,u_id,c_id,trans_type,trans_date from mtg_card_transaction WHERE u_id = ?", userId)

	fmt.Println("recuperato i risultati della query")

	if err != nil {
		fmt.Print(err)
		fmt.Println(" ho un errore nella query")
		return cts
	}

	for results.Next() {
		var ct CardTransaction
		err = results.Scan(&ct.RId, &ct.IdUser, &ct.IdCard, &ct.Type, &ct.DTtrans)

		fmt.Print(err)
		if err != nil {
			fmt.Print("sono dentro il check di errore!")
			return []CardTransaction{}
		}
		fmt.Println("appending transaction to array")
		cts = append(cts, ct)
		fmt.Printf("%+v", ct)
	}

	fmt.Print(cts)
	return cts
}

func RetrieveList(userId int) []OwnedCard {
	var collection = []OwnedCard{}

	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

	defer db.Close()

	if err != nil {
		return collection
	}

	results, err := db.Query("SELECT id_card,quantity,foil,foil_quantity from mtg_collection WHERE id_owner = ?", userId)

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

func AddCard(userId int, cardColl OwnedCard) []OwnedCard {
	db, err := sql.Open("mysql", "root:s8s8tif8@tcp(localhost:3306)/MTGOrganizer")

	defer db.Close()

	if err != nil {
		return []OwnedCard{}
	}

	actualTime := time.Now().Format(time.RFC3339)

	stmts := []*transaction.PipelineStmt{
		transaction.NewPipelineStmt(
			"INSERT INTO mtg_collection VALUES(?,?,?,?,0,0) ON DUPLICATE KEY UPDATE quantity=?",
			userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Quantity),
		transaction.NewPipelineStmt(
			"INSERT INTO mtg_card_transaction (u_id,c_id,trans_type,trans_date) VALUES(?,?,'add',?)",
			userId, cardColl.IdCard, actualTime),
	}

	err = transaction.WithTransaction(db, func(tx transaction.Transaction) error {
		_, err := transaction.RunPipeline(tx, stmts...)
		return err
	})

	if err != nil {
		panic(err)
	}

	// insert, err := db.Prepare("INSERT INTO mtg_collection VALUES(?,?,?,?,0,0) ON DUPLICATE KEY UPDATE quantity=?")
	// if err != nil {
	// 	panic(err)
	// }

	// _, err = insert.Exec(userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Quantity)
	// if err != nil {
	// 	panic(err)
	// }

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
				"DELETE FROM table_name WHERE id_owner=? AND id_card=?",
				userId, cardColl.IdCard),
			transaction.NewPipelineStmt(
				"INSERT INTO mtg_card_transaction (u_id,c_id,trans_type,trans_date) VALUES(?,?,'remove',?)",
				userId, cardColl.IdCard, actualTime),
		}
	} else { // altrimenti faccio update
		stmts = []*transaction.PipelineStmt{
			transaction.NewPipelineStmt(
				"INSERT INTO mtg_collection VALUES(?,?,?,?,0,0) ON DUPLICATE KEY UPDATE quantity=?",
				userId, cardColl.IdCard, cardColl.IdSet, cardColl.Quantity, cardColl.Quantity),
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
