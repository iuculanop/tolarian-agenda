/* eslint-env browser */

// Central point for choosing the type of history (HTML5 or hash-based)
import { createHashHistory as createHistoryFn, useBeforeUnload } from 'history';
// import { createHistory as createHistoryFn, useBeforeUnload } from 'history';
import { useRouterHistory } from 'react-router';

export const appHistory = useRouterHistory(
  useBeforeUnload(
    createHistoryFn
  )
)({
  // FIXME: Is there a better way?
  // basename: document.getElementsByTagName('base')[0].getAttribute('href'),
  // queryKey: false,
});
