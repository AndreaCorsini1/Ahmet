/**
 * Http method for fetching the business logic.
 * The methods assume the api communicate with json format.
 */
import React from 'react';

export function APIGet(props) {
  fetch(props.uri, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + props.token,
      Accept: 'application/json',
    },
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
  fetch(props.uri, {
    method: 'DELETE',
    headers: {
      Authorization: 'Token ' + props.token,
      Accept: 'application/json',
    },
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
  fetch(props.uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + props.token,
      Accept: 'application/json',
    },
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
