/**
 * Http method for fetching the business logic.
 * The methods assume the api communicate with json format.
 */
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Make the headers for all the http verbs.
 * Note that the token is added automatically if present in session storage.
 */
async function makeHeaders() {
  let headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  try {
    let token = await AsyncStorage.getItem('@token');
    if (token) {
      headers.Authorization = 'Token ' + token;
    }
  } catch (e) {
    console.log(e);
  }
  return headers;
}

export function APIGet(props) {
  fetch(props.uri, {
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
  fetch(props.uri, {
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

export async function checkToken() {
  try {
    let value = await AsyncStorage.getItem('@token');
    console.log(value);
    return value === null;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function APIPost(props) {
  fetch(props.uri, {
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
  let url = 'http://10.0.2.2:8080/api/v0.1/token-auth/';
  //token_real = null;
  fetch(url, {
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
      },
      (error) => {
        props.onError(error.message);
      },
    );
}

export async function deleteToken() {
  try {
    await AsyncStorage.removeItem('@token');
  } catch (e) {
    console.log(e);
  }
}
