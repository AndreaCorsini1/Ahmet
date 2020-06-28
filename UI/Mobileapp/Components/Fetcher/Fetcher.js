/**
 * Http method for fetching the business logic.
 * The methods assume the api communicate with json format.
 */
import React from 'react';
export var token_real = null;
// Domain of the API
const base_url = 'http://192.168.1.61:8080/api/v0.1'


/**
 * Make the headers for all the http verbs.
 * Note that the token is added automatically if present in session storage.
 */
function makeHeaders() {
  let headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token_real !== null) {
    headers.Authorization = 'Token ' + token_real;
  }
  return headers;
}

export function APIGet(props) {
  fetch(base_url + props.uri, {
    headers: makeHeaders(),
    method: 'GET',
    cache: 'no-cache',
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then(
      (data) => props.onSuccess(data),
      (error) => props.onError(error),
    );
}

export function APIDelete(props) {
  fetch(base_url + props.uri, {
    method: 'DELETE',
    headers: makeHeaders(),
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return 'Successfully deleted';
      }
      throw Error(response.statusText);
    })
    .then(
      (data) => props.onSuccess(data),
      (error) => props.onError(error),
    );
}

export function APIPost(props) {
  fetch(base_url + props.uri, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(props.data),
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then(
      (data) => props.onSuccess(data),
      (error) => props.onError(error),
    );
}

export function getToken(props) {
  token_real = null;
  fetch(base_url + '/token-auth/', {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify({
      username: props.username,
      password: props.password,
    }),
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then(
      (data) => {
        props.setToken(data.token);
        token_real = data.token;
      },
      (error) => {
        props.onError(error.message);
      },
    );
}

export function deleteToken() {
  token_real = null;
}
