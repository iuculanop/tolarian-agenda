import { PropTypes } from 'react';

export const OccurrencesPropType = PropTypes.arrayOf(
    PropTypes.shape({
      StartEnd: PropTypes.shape({
        StartDateTime: PropTypes.string.isRequired,
        EndDateTime: PropTypes.string.isRequired,
      }),
    })
  );

export const ShortEventPropType = PropTypes.shape({
  Id: PropTypes.string.isRequired,
  Name: PropTypes.string,
  Category: PropTypes.string,
  Schedule: PropTypes.shape({
    Occurrence: OccurrencesPropType,
  }),
  Venue: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Address: PropTypes.shape({
      Street: PropTypes.string,
      City: PropTypes.string,
      Province: PropTypes.string,
    }),
  }),
});
