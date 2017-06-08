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

// Provides storage and retrieval of customer data with a promise-based API.
// Storage is in-memory; modify to connect to a persistent datastore.
class CustomerStore {
  constructor () {
    this.customers = {};
  }

  static get MODE_AGENT () {
    return 'AGENT';
  }

  static get MODE_OPERATOR () {
    return 'OPERATOR';
  }

  getOrCreateCustomer (customerId) {
    if (!customerId || customerId.length === 0) {
      return Promise.reject(new Error('You must specify a customer id'));
    }

    const customerData = this.retrieve(customerId);

    // If there was no customer with this id, create one
    if (!customerData) {
      console.log('Storing new customer with id: ', customerId);
      return this
        .setCustomer(customerId, {
          id: customerId,
          mode: CustomerStore.MODE_AGENT
        })
        .then((newCustomer) => {
          // Attach this temporary flag to indicate that the customer is
          // freshly created.
          newCustomer.isNew = true;
          return newCustomer;
        });
    }

    return Promise.resolve(customerData);
  }

  setCustomer (customerId, customerData) {
    console.log('CustomerStore.setCustomer called with ', customerData);
    if (!customerId || customerId.length === 0 || !customerData) {
      return Promise.reject(new Error('You must specify a customer id and provide data to store'));
    }

    console.log('Updating customer with id: ', customerId);
    this.store(customerId, customerData);

    return Promise.resolve(customerData);
  }

  // This function could be modified to support persistent database storage
  store (customerId, data) {
    // In this case we just simulate serialization to an actual datastore
    this.customers[customerId] = JSON.stringify(data);
  }

  // This function could be modified to support persistent database storage
  retrieve (customerId) {
    // In this case we just simulate deserialization from an actual datastore
    const customerData = this.customers[customerId];
    return customerData ? JSON.parse(customerData) : null;
  }
}

module.exports = CustomerStore;
