import {store} from "react-notifications-component";

/**
 * TODO: do it once in login
 */
function getToken(props) {
  let url = "http://localhost:8080/api/v0.1/token-auth/";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Accept': 'application/json',
    },
    body: JSON.stringify({username: 'Andrea', password: 'andrea'})
  })
  .then(response => response.json())
  .then(
    (data) => {
      props.setToken(data.token);
    },
    (error) => {
      console.error(error.message);
      store.addNotification({
        title: "Error",
        message: error.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
      })
    }
  );
}

export default getToken;