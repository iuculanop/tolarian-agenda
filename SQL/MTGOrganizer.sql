-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Dic 21, 2018 alle 09:16
-- Versione del server: 10.1.26-MariaDB
-- Versione PHP: 7.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `MTGOrganizer`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `mtg_card_transaction`
--

CREATE TABLE `mtg_card_transaction` (
  `r_id` int(11) NOT NULL,
  `u_id` int(16) NOT NULL COMMENT 'id utente',
  `c_id` int(16) NOT NULL COMMENT 'id carta',
  `trans_type` varchar(16) NOT NULL COMMENT 'tipo di transazione',
  `trans_date` datetime NOT NULL COMMENT 'data di transazione'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tabella di tracking delle transazioni di un collezionista';

--
-- Dump dei dati per la tabella `mtg_card_transaction`
--

INSERT INTO `mtg_card_transaction` (`r_id`, `u_id`, `c_id`, `trans_type`, `trans_date`) VALUES
(1, 1, 136142, 'add', '2018-12-20 09:40:31'),
(2, 1, 439602, 'add', '2018-12-20 10:14:13'),
(3, 1, 439602, 'add', '2018-12-20 10:14:14'),
(4, 1, 439602, 'add', '2018-12-20 10:14:14'),
(5, 1, 439602, 'add', '2018-12-20 10:14:15'),
(6, 1, 439602, 'add', '2018-12-20 10:14:16'),
(7, 1, 452751, 'remove', '2018-12-20 13:39:54'),
(8, 1, 452753, 'remove', '2018-12-20 13:45:50'),
(9, 1, 452753, 'add', '2018-12-20 13:45:54'),
(10, 1, 87952, 'add', '2018-12-21 09:50:10');

-- --------------------------------------------------------

--
-- Struttura della tabella `mtg_collection`
--

CREATE TABLE `mtg_collection` (
  `id_owner` int(32) NOT NULL,
  `id_card` int(32) NOT NULL,
  `mtg_set` varchar(5) DEFAULT NULL,
  `quantity` int(16) NOT NULL,
  `foil` tinyint(1) NOT NULL,
  `foil_quantity` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `mtg_collection`
--

INSERT INTO `mtg_collection` (`id_owner`, `id_card`, `mtg_set`, `quantity`, `foil`, `foil_quantity`) VALUES
(1, 87952, 'RAV', 1, 0, 0),
(1, 96929, 'GPT', 1, 0, 0),
(1, 96951, 'GPT', 3, 0, 0),
(1, 96953, 'GPT', 4, 0, 0),
(1, 96962, 'GPT', 1, 0, 0),
(1, 136142, 'FUT', 1, 0, 0),
(1, 439602, 'UST', 5, 0, 0),
(1, 452751, 'GRN', 3, 0, 0),
(1, 452752, 'GRN', 1, 0, 0),
(1, 452753, 'GRN', 3, 0, 0),
(1, 452754, 'GRN', 2, 0, 0),
(1, 452755, 'GRN', 3, 0, 0),
(1, 452756, 'GRN', 1, 0, 0),
(1, 452757, 'GRN', 1, 0, 0),
(1, 452759, 'GRN', 1, 0, 0),
(1, 452760, 'GRN', 1, 0, 0),
(1, 452761, 'GRN', 1, 0, 0),
(1, 452763, 'GRN', 1, 0, 0),
(1, 452764, 'GRN', 1, 0, 0),
(1, 452765, 'GRN', 3, 0, 0),
(1, 452766, 'GRN', 2, 0, 0),
(1, 452767, 'GRN', 3, 0, 0),
(1, 452768, 'GRN', 3, 0, 0),
(1, 452769, 'GRN', 1, 0, 0),
(1, 452770, 'GRN', 1, 0, 0),
(1, 452771, 'GRN', 3, 0, 0),
(1, 452772, 'GRN', 3, 0, 0),
(1, 452773, 'GRN', 4, 0, 0),
(1, 452775, 'GRN', 4, 0, 0),
(1, 452777, 'GRN', 3, 0, 0),
(1, 452778, 'GRN', 4, 0, 0),
(1, 452779, 'GRN', 3, 0, 0),
(1, 452780, 'GRN', 2, 0, 0),
(1, 452781, 'GRN', 4, 0, 0),
(1, 452782, 'GRN', 3, 0, 0),
(1, 452794, 'GRN', 2, 0, 0),
(1, 453008, 'GRN', 1, 0, 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `MTG_EXPANSION_SET`
--

CREATE TABLE `MTG_EXPANSION_SET` (
  `name` varchar(128) NOT NULL,
  `shortCode` varchar(3) NOT NULL,
  `releaseDate` date NOT NULL,
  `border` varchar(16) NOT NULL,
  `type` varchar(16) NOT NULL,
  `block` int(11) NOT NULL,
  `magicCardsInfoCode` varchar(3) NOT NULL,
  `mkmInfoName` varchar(128) NOT NULL,
  `mkmInfoCode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `mtg_user`
--

CREATE TABLE `mtg_user` (
  `u_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `surname` varchar(32) NOT NULL,
  `id_name` varchar(16) NOT NULL,
  `password` varchar(256) NOT NULL,
  `avatar` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `mtg_user`
--

INSERT INTO `mtg_user` (`u_id`, `name`, `surname`, `id_name`, `password`, `avatar`) VALUES
(1, 'Paolo', 'Iuculano', 'p.iuculano', 'el.mariachi82', ''),
(2, 'Simone', 'Penati', 's.penati', 'gargadonte82', '');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `mtg_card_transaction`
--
ALTER TABLE `mtg_card_transaction`
  ADD PRIMARY KEY (`r_id`),
  ADD KEY `utente` (`u_id`);

--
-- Indici per le tabelle `mtg_collection`
--
ALTER TABLE `mtg_collection`
  ADD PRIMARY KEY (`id_owner`,`id_card`);

--
-- Indici per le tabelle `MTG_EXPANSION_SET`
--
ALTER TABLE `MTG_EXPANSION_SET`
  ADD PRIMARY KEY (`shortCode`);

--
-- Indici per le tabelle `mtg_user`
--
ALTER TABLE `mtg_user`
  ADD PRIMARY KEY (`u_id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `mtg_card_transaction`
--
ALTER TABLE `mtg_card_transaction`
  MODIFY `r_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT per la tabella `mtg_user`
--
ALTER TABLE `mtg_user`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `mtg_card_transaction`
--
ALTER TABLE `mtg_card_transaction`
  ADD CONSTRAINT `utente` FOREIGN KEY (`u_id`) REFERENCES `mtg_user` (`u_id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `mtg_collection`
--
ALTER TABLE `mtg_collection`
  ADD CONSTRAINT `utente_collezione` FOREIGN KEY (`id_owner`) REFERENCES `mtg_user` (`u_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
