// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const AppConstants = require('./appConstants.js');
const ChatConnectionHandler = require('./chatConnectionHandler.js');

// Handles the connection to an individual customer
class CustomerConnectionHandler extends ChatConnectionHandler {
  constructor (socket, messageRouter, onDisconnect) {
    super(socket, messageRouter, onDisconnect);
    // In this sample, we use the socket's unique id as a customer id.
    this.init(socket.id);
    this.attachHandlers();
  }

  init (customerId) {
    console.log('A customer joined: ', this.socket.id);
    this.router._sendConnectionStatusToOperator(customerId)
    // Determine if this is a new or known customer
      .then(() => this.router.customerStore.getOrCreateCustomer(customerId))
      .then(customer => {
        console.log('A customer connected: ', customer);
        // If new, begin the API.AI conversation
        if (customer.isNew) {
          return this.router._sendEventToAgent(customer)
            .then(response => {
              this._respondToCustomer(response.result.fulfillment.speech, this.socket);
            });
        }
        // If known, do nothing - they just reconnected after a network interruption
      })
      .catch(error => {
        // Log this unspecified error to the console and
        // inform the customer there has been a problem
        console.log('Error after customer connection: ', error);
        this._sendErrorToCustomer(error);
      });
  }

  attachHandlers () {
    this.socket.on(AppConstants.EVENT_CUSTOMER_MESSAGE, (message) => {
      console.log('Received customer message: ', message);
      this._gotCustomerInput(message);
    });
    this.socket.on(AppConstants.EVENT_DISCONNECT, () => {
      console.log('Customer disconnected');
      this.router._sendConnectionStatusToOperator(this.socket.id, true);
      this.onDisconnect();
    });
  }

  // Called on receipt of input from the customer
  _gotCustomerInput (utterance) {
    // Look up this customer
    this.router.customerStore
      .getOrCreateCustomer(this.socket.id)
      .then(customer => {
        // Tell the router to perform any next steps
        return this.router._routeCustomer(utterance, customer, this.socket.id);
      })
      .then(response => {
        // Send any response back to the customer
        if (response) {
          return this._respondToCustomer(response, this.socket);
        }
      })
      .catch(error => {
        // Log this unspecified error to the console and
        // inform the customer there has been a problem
        console.log('Error after customer input: ', error);
        this._sendErrorToCustomer(error);
      });
  }

  // Send a message or an array of messages to the customer
  _respondToCustomer (response) {
    console.log('Sending response to customer:', response);
    if (Array.isArray(response)) {
      response.forEach(message => {
        this.socket.emit(AppConstants.EVENT_CUSTOMER_MESSAGE, message);
      });
      return;
    }
    this.socket.emit(AppConstants.EVENT_CUSTOMER_MESSAGE, response);
    // We're using Socket.io for our chat, which provides a synchronous API. However, in case
    // you want to swich it out for an async call, this method returns a promise.
    return Promise.resolve();
  }

  _sendErrorToCustomer () {
    // Immediately notifies customer of error
    console.log('Sending error to customer');
    this.socket.emit(AppConstants.EVENT_SYSTEM_ERROR, {
      type: 'Error',
      message: 'There was a problem.'
    });
  }
}

module.exports = CustomerConnectionHandler;
