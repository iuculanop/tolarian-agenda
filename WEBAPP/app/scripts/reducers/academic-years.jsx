import { getActualAcademicYear } from 'util/AcademicYears.jsx';

const selectedYear = getActualAcademicYear();

const academicYears = (state = { selectedYear }, action) => {
  switch (action.type) {
    case 'SELECT_ACYEAR':
      return { selectedYear: action.payload };
    default:
      return state;
  }
};

export default academicYears;
