/**
 * Http method for fetching the business logic.
 * The methods assume the api communicate with json format.
 */
import React from "react";

/**
 * Make the headers for all the http verbs.
 * Note that the token is added automatically if present in session storage.
 */
function makeHeaders() {
  let headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (sessionStorage.getItem('token'))
    headers['Authorization'] = 'Token ' + sessionStorage.getItem('token');

  return headers;
}

/**
 * Make dynamic uri for connecting to the api.
 *
 * @param uri: resource to fetch
 */
function makeUri(uri) {
  return (window.location.protocol + '//' + window.location.hostname +
          ':8080/api/v0.1' + uri);
}

export function APIGet(props) {
  fetch(makeUri(props.uri), {
    headers: makeHeaders(),
    method: 'GET',
    cache: 'no-cache',
  }).then(response => {
    if (response.status >= 200 && response.status <= 299)
      return response.json();
    throw Error(response.statusText)
  })
  .then(
    (data) => (props.onSuccess(data)),
    (error) => (props.onError(error))
  );
}

export function APIDelete(props) {
  fetch(makeUri(props.uri), {
    method: "DELETE",
    headers: makeHeaders()
  }).then(response => {
    if (response.status >= 200 && response.status <= 299)
      return "Successfully deleted";
    throw Error(response.statusText)
  }).then(
    (data) => (props.onSuccess(data)),
    (error) => (props.onError(error))
  );
}

export function APIPost(props) {
  fetch(makeUri(props.uri), {
    method: "POST",
    headers: makeHeaders(),
    body: JSON.stringify(props.data)
  }).then(response => {
    if (response.status >= 200 && response.status <= 299)
      return response.json();
    throw Error(response.statusText)
  }).then(
    (data) => (props.onSuccess(data)),
    (error) => (props.onError(error))
  );
}