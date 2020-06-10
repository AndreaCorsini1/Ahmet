import React, {Component} from 'react';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';

function PrintError() {
  return showMessage({
    message: 'Oooops!!',
    description: 'Something went wrong',
    type: 'danger',
  });
}

export default PrintError;
