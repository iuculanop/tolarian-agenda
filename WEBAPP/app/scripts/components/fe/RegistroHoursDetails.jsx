import React, { PropTypes } from 'react';
import FormaDidStatus from 'components/fe/FormaDidStatus.jsx';

import { calculateHours } from 'util/ArrayUtils.jsx';

function checkStatusByFormaDid(formaDid) {
  if (formaDid.orePreviste !== formaDid.oreRegistrate) {
    return false;
  }
  return true;
}

function hoursStatusByFormaDid(registry, occurrences) {
  const formeDidList = [];
  for (let i = 0; i < registry.descFD.length; i++) {
    const hoursByFormaDid = {};
    hoursByFormaDid.idFormaDid = registry.descFD[i].idFormaDidattica;
    hoursByFormaDid.descFormaDid = registry.descFD[i].descrizione;
    hoursByFormaDid.orePreviste = registry.descFD[i].oreDocente;
    hoursByFormaDid.oreRegistrate = calculateHours(occurrences, hoursByFormaDid.idFormaDid);
    formeDidList.push(hoursByFormaDid);
  }
  return formeDidList;
}

function RegistroHoursDetails({ registryInfo, registryOccurrences, toCheck }) {
  let formeDid;
  if (toCheck) {
    formeDid = hoursStatusByFormaDid(registryInfo, registryOccurrences)
      .map((o, i) =>
        <FormaDidStatus formaDid={o} status={checkStatusByFormaDid(o)} key={i} />);
  } else {
    formeDid = hoursStatusByFormaDid(registryInfo, registryOccurrences)
    .map((o, i) => <FormaDidStatus formaDid={o} key={i} />);
  }
  return (
    <div>
      {formeDid}
    </div>
  );
}

RegistroHoursDetails.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  toCheck: PropTypes.bool,
};

export default RegistroHoursDetails;
