import React from 'react';
// formatters for React Bootstrap Table

export function htmlEscape(str) {
  return String(str).replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
}

// Formattatore per icone di stato registro
// USATO IN: RegistriList.jsx
export function stateToIconFormatter(cell) {
  switch (cell) {
    case 'N':
      return (
        <span title="Aperto">
          <i className="fa fa-unlock-alt fa-lg"></i>
        </span>
      );
    case 'C':
      return (
        <span className="state-wait" title="Chiuso in attesa di approvazione">
          <i className="fa fa-lock fa-lg"></i>
        </span>
      );
    case 'A':
      return (
        <span className="state-ok" title="Approvato">
          <i className="glyphicon glyphicon-thumbs-up"></i>
        </span>
      );
    case 'Z':
      return (
        <span className="state-ok" title="Approvato e archiviato">
          <i className="fa fa-lock fa-lg"></i>
        </span>
      );
    default:
      return (
        <span title="Da aprire">
          <i className="fa fa-key fa-lg"></i>
        </span>
      );
  }
}

// Formattatore per tooltip con CdL su nome AF del registro
// USATO IN: RegistriList.jsx
export function nameFormatter(cell, row) {
  if (row.dataChiusuraCopertura !== null) {
    return `<span title="Corso di Studio: ${row.descCDL}">${cell}</span>
<span title="Attenzione: questa copertura è stata chiusa in data ${row.dataChiusuraCopertura}
Si prega di rendicontare solo le attività svolte fino alla data di chiusura."
class='float-right statusKO'>
<i class='glyphicon glyphicon-exclamation-sign'></i></span>`;
  }
  return `<span title="Corso di Studio: ${row.descCDL}">${cell}</span>`;
}

// Formattatore elenco didattico di forme didattiche afferenti al registro
// USATO IN: RegistriList.jsx
export function formaDidatticaFormatter(cell) {
  const list = cell.map((listValue) => `<li>${listValue.descrizione}
    (${listValue.oreDocente})</li>`).join('');
  return `<ul class="no-margin-table">${list}</ul>`;
}

// Formattatore informazioni aggiuntive di registro
// USATO IN: RegistriList.jsx
export function infoFormatter(cell, row) {
  return (
    <span>
      <b>Cod. AF:</b> {cell}<br />
      <b>Cod. Edizione:</b> {row.codEdizione}<br />
      <b>Modulo:</b> {row.descModulo || 'Mod. Unico'}<br />
      <b>Turno:</b> {row.descTurno || 'Turno Unico'}<br />
    </span>
  );
}

// Formattatore per ore registrate e previste per registro
// USATO IN: RegistriList.jsx
export function oreSommateFormatter(cell, row) {
  return `${row.totaliRegistrate} / ${cell}`;
}

export function argumentFormatter(cell) {
  if (cell === '') {
    return (
      <span title="Campo obbligatorio" className="statusKO">
        <i className="glyphicon glyphicon-pencil"></i>
      </span>
    );
  }
  return `<span>${cell}</span><span class='float-right vcenter trasp'>
<i class='glyphicon glyphicon-pencil'></i></span>`;
}

export function editFormatter(cell) {
  if (cell === '') {
    return (
      <span title="Campo obbligatorio" className="statusKO">
        <i className="glyphicon glyphicon-pencil"></i>
      </span>
    );
  }
  return `<span>${cell}</span><span class='float-right vcenter trasp'>
<i class='glyphicon glyphicon-pencil'></i></span>`;
}

export function editFormatterNoReq(cell) {
  return `<span>${cell || ''}</span><span class='float-right vcenter trasp'>
<i class='glyphicon glyphicon-pencil'></i></span>`;
}

export function academicYearFormatter(cell) {
  return `<span>${cell - 1}/${cell}</span>`;
}
