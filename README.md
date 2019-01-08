# Dialogflow: Agent to Human Handoff Sample

This sample consists of a simple Dialogflow agent, a Node.js server, and a web
interface that together demonstrate an approach for handling text-based conversations
from a Dialogflow agent to a human operator.

**This sample is designed as a learning tool and experimentation. This is not as a finished solution nor a base platform for any production development.**

### Features
* Agent will escalate to a human operator on-demand
* Agent will escalate to a human operator after repeated failure to match an intent
* Server routes conversation between agent and human operator depending on context
* Server supports multiple concurrent conversations between customer, agent and operator
* Customer web client supports real-time chat with agent or operator
* Operator web client supports real-time observation and participation in multiple customer conversations
* Operator web client demonstrates alerting of operator in case of customer escalation

### Limitations
* **There is no authentication of customers or operators. In this limited demonstration, communication
between users is not secure. This code is provided as an example, not a finished solution.**
* Active conversations are stored in-memory with no on-disk persistence (though code could
easily be modified to support this).
* Operators can only monitor and communicate with customers that have subsequently connected. Previously
connected customers are ignored.
* User interface is very rudimentary.

### Technology Stack
* [Dialogflow](https://dialogflow.com/)
* [Node.js](https://nodejs.org/en/) v6.9.1+
* [Express.js](https://expressjs.com/)
* [Socket.IO](https://socket.io/)
* [JQuery](https://jquery.com/)

## Setup Instructions

### Part A: Steps for Dialogflow
1. [Sign-up](https://console.dialogflow.com/api-client/authorize_url_google/nopopup) or [Log-in](https://console.dialogflow.com/api-client/#/login) to your Dialogflow account.
2. In [Dialogflow's console](https://console.dialogflow.com), select **Create Agent** in the left navigation and fill in the required fields and **Save**.
  + Name for your agent, i.e. `agent-human-handoff-sample`
4. Select `Create`.
5. Go to the settings ⚙ > **Export and Import** tab >  **Restore from zip**.
    + Upload the `HumanHandoffDemonstrationAgent.zip` file located in this repo.


### Part B: Steps for Node.js
1. Download/clone this repo.
2. Ensure at least Node.js v6.9.1 is installed.
3. Within the repo directory, $ **npm install** to install all of the project's dependencies.
4. To connect to your agent, you will need your Dialogflow Project ID.
  + Back in Dialogflow console under **Settings** ⚙ > **General** tab > copy **Project ID**.
5. For authentication, you will need to download a service account key.
  + Right below **Project ID** > click **Service Account** email address.  
  + In the resulting page, find the
same service account email address in the table, and select the three dots under the **Actions** column > **Create key**, **JSON**, and then **CREATE** to download a key file.
6. In terminal, to start the server:
```shell
$ DF_PROJECT_ID=<project ID> DF_SERVICE_ACCOUNT_PATH=<path to key file> node app.js
```
For example:
 **$ DF_PROJECT_ID=**`agent-human-handoff-sample` **DF_SERVICE_ACCOUNT_PATH=**`~/Download/keyfile.json`** node app.js**

7. In your terminal, you should see **Listening on *:3000** and the server is now running.<sup>A.</sup>

  <sup>A.</sup> If you see `Error: listen EADDRINUSE :::3000` when starting the server, there is
  already a process listening on port 3000 on your system. Identify and close that process, or edit `app.js`
  to connect to a different port.

### Part C: Demonstration
1. With the server running, go to the [Operator interface](http://localhost:3000/operator) in your browser.
  + You should see a mostly empty page with the word 'Operator' and a chat form.
2. Open up a new browser tab and go to [Customer interface](http://localhost:3000/customer).
  + After loading,
the client should immediately connect to the Dialogflow agent. You'll see the welcome message from the agent
appear beneath the Customer title.
3. Return to the Operator interface tab.
  + You will see that a tab has appeared that represents the conversation
with this customer. It will currently be empty.
4. Return to the Customer interface tab.
  + You can use the form to chat with the agent With **Send** or return.
  + To demonstrate functional  conversation, ask `what is your purpose?`.
5. In Operator interface, you will see the history of messages between the customer and the agent. If you
attempt to enter a message, you will see a warning that the customer has not yet been escalated.
6. Return to the Customer interface.
  + To request an operator, ask a variation of `let me talk to a person`.
  + The Operator interface will pop up a dialog box to alert the operator that a new escalation has occurred.
7. If the Operator interface took control as a result of alert dialog, return to the Customer interface.
You will see the system has responded with an introduction message from the operator. After this point,
the operator can respond to the customer's messages freely.
8. Still on the Customer interface, send another message (for example, `I'm having difficulty with my product`).
9. Open the Operator interface. You will see the customer's message. You can use the form to respond.
10. Switch back to the Customer interface.
  + If you responded to their message in the previous step, you will
see your response in the chat log.
11. In a new browser tab and go open a second [Customer interface](http://localhost:3000/customer).
12. In this new Customer interface, ask the agent something it doesn't understand (e.g. `I would like to book a flight`).
 The agent will ask for clarification.
13. Switch to the Operator interface.
  + You will see that a second tab has appeared, representing the second customer.
Click this tab to view the conversation logs.
14. Switch back to the new Customer interface and enter another arbitrary statement (e.g. `I want to book a flight`).
  + With
the agent unable to determine the customer's intent twice in a row, it will automatically escalate to an operator.

## Explanation
* The server communicates with the clients via Socket.IO. It initially sends all customer messages to Dialogflow
and returns the responses to the customer.
* The server monitors the `context` property of Dialogflow's response for a specific context named `operator_request`.
When it sees this context, it stops routing this customer's messages to Dialogflow and allows the operator to respond.
* The Dialogflow agent can apply this context in two modes.
    * In one mode, it is applied to the `Output contexts` of the `Operator Request` intent, thus switching
    the customer to an operator when they explicitly ask for it.
    * In the other mode, it is applied to the `Output contexts` of the intent `Default Fallback Intent - fallback`.
    To see this intent in the Dialogflow interface, click the downward arrow on the intent named `Default Fallback Intent`.
    Because this intent is specified as the fallback intent for the default fallback intent, it will be triggered
    only if the user has failed to provide a matchable input twice in a row. The first unmatched input triggers the
    `Default Fallback Intent`. The second unmatched input triggers `Default Fallback Intent - fallback`. This causes
    the `operator_request` context to be applied, triggering escalation by the server.

### Part D: Custom Implementation
You can modify this sample as a basis for your own implementation, but please be aware of the limitations expressed above.

When creating your own Dialogflow agent, you may wish to make use of the
[Support Prebuilt Agent](https://console.dialogflow.com/api-client/#/agent//prebuiltAgents/Support), which provides a framework
for answering common support-related inquiries and providing a channel for users to contact you.

## References and How to report bugs
* If you find any issues, please open a bug here on GitHub.
* Questions? [StackOverflow](https://stackoverflow.com/questions/tagged/dialogflow).

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md.

## License
See LICENSE.md.

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the
[Google APIs Terms of Service](https://developers.google.com/terms/).
