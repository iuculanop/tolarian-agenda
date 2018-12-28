import queryString from 'query-string';

export const stringifyQuery = queryString.stringify;
export const parseQueryString = queryString.parse;

export default {
  stringify: stringifyQuery,
  parse: parseQueryString,
};
