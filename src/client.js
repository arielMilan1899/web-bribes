/* eslint-disable no-console */
import {adminApiUrl, localStorageAuthKey} from "./config";
import {ApolloClient, ApolloLink, Observable} from '@apollo/client';
import {BatchHttpLink} from "apollo-link-batch-http";
import {onError} from "apollo-link-error";
import {createBrowserHistory} from 'history';
import {InMemoryCache} from "apollo-cache-inmemory";

export const history = createBrowserHistory();

const request = operation => {
  const token = localStorage.getItem(localStorageAuthKey);
  operation.setContext({
    headers: {
      authorization: token ? `JWT ${token}` : '',
      accept: 'application/json',
      'content-type': 'application/json',
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    }),
);

export default new ApolloClient({
  link: ApolloLink.from([
    onError(({networkError, operation}) => {
      if (networkError) {
        const {response} = operation.getContext();

        // if server is offline
        if (!response) {
          console.log('Server Offline');
        }
        if (response && response.status === 403) {
          history.push('/login');
        }
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    requestLink,
    new BatchHttpLink({
      uri: adminApiUrl,
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  }
});
