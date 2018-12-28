import React, { PropTypes } from 'react';
import AttDidHoursCounter from 'components/fe/AttDidHoursCounter.jsx';

function hoursByAttDid(occurrences) {
  const arrAttDid = [];
  for (let i = 0; i < occurrences.length; i++) {
    if (arrAttDid[occurrences[i].descFormaDid]) {
      arrAttDid[occurrences[i].descFormaDid].ore += occurrences[i].ore;
    } else {
      arrAttDid[occurrences[i].descFormaDid] = {
        descFormaDid: occurrences[i].descFormaDid,
        ore: occurrences[i].ore,
      };
    }
  }
  return arrAttDid;
}

function TrasversalHoursDetails({ registryOccurrences }) {
  const formeDid = hoursByAttDid(registryOccurrences);
  const keys = Object.keys(formeDid);
  const outputData = [];
  keys.forEach(key => {
    outputData.push(formeDid[key]);
  });
  return (
    <div>
      {outputData.map((o, i) => <AttDidHoursCounter formaDid={o} key={i} />)}
    </div>
  );
}

TrasversalHoursDetails.propTypes = {
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrasversalHoursDetails;
