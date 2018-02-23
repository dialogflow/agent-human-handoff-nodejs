# Dialogflow: Agent to Human Handoff Sample

This sample consists of a simple Dialogflow agent, a node.js server and a web
interface that together demonstrate an approach for handing text-based conversations
from an Dialogflow agent to a human operator.

**This extensively commented sample is designed as a learning tool and a platform for
experimentation, not a finished solution.**

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
1. Log in to the [Dialogflow Console](https://console.dialogflow.com).
1. Create a new agent using the dropdown at the top of the left hand menu, next to the gear icon.
If the menu is not visible, click the icon with three horizontal lines to open it.
1. Type a name for your agent. Any name will work, but `agent-human-handoff-sample` is suggested.
1. Click `Save` to save the project, and wait for it to complete.
1. Click the gear icon near the top of the menu to see the project settings.
1. Click the `Export and Import` tab.
1. Click `RESTORE FROM ZIP`. Follow the directions to restore from the HumanHandoffDemonstrationAgent.zip
 in this repo.

### Part B: Steps for Node.js
1. Clone or download the contents of this repo to a location on disk.
1. Ensure at least Node.js v6.9.1 is installed.
1. Within the repo directory, type `npm install` to install all of the project's dependencies.
1. To connect to your agent, you will need your Dialogflow client access token. To obtain it, open the project you
created in *Part A* in the Dialogflow console. Click the gear icon near the top of the menu to see the
project settings. Copy the `Client access token` from the `API keys` section of the `General` tab.
1. To start the server, enter `APIAI_ACCESS_TOKEN=<client access token> node app.js` from within the repo
directory, where `<client access token>` is replaced with the access token you copied in the previous step.
1. You should see the text `Listening on *:3000`. The server is now ready to use.

**Note:** If you see the error `Error: listen EADDRINUSE :::3000` when starting the server, there is
already a process listening on port 3000 on your system. Identify and close that process, or edit `app.js`
to connect to a different port.

### Part C: Demonstration
1. With the server running, open [http://localhost:3000/operator](http://localhost:3000/operator) in your browser
 to open the Operator interface. You should see a mostly empty page with the word 'Operator' and a chat form.
1. In another browser tab, open [http://localhost:3000/customer](http://localhost:3000/customer). After loading,
the client should immediately connect to the Dialogflow agent. You'll see the welcome message from the agent
appear beneath the Customer title.
1. Return to the Operator interface. You will see that a tab has appeared that represents the conversation
with this customer. It will currently be empty.
1. Return to the Customer interface. You can use the form to chat with the agent by clicking `Send` or hitting return.
To demonstrate functional  conversation, try asking it `what is your purpose?`.
1. Open the Operator interface. You will see the history of messages between the customer and the agent. If you
attempt to enter a message, you will see a warning that the customer has not yet been escalated.
1. Open the Customer interface. To request an operator, ask a variation of `let me talk to a person`. The
Operator interface will pop up a dialog box to alert the operator that a new escalation has occurred.
1. If the Operator interface took control as a result of alert dialog, return to the Customer interface.
You will see the system has responded with an introduction message from the operator. After this point,
the operator can respond to the customer's messages freely.
1. Still on the Customer interface, send another message (for example, `I'm having difficulty with my product`).
1. Open the Operator interface. You will see the customer's message. You can use the form to respond.
1. Switch back to the Customer interface. If you responded to their message in the previous step, you will
see your response in the chat log.
1. Open a new browser tab and go to [http://localhost:3000/customer](http://localhost:3000/customer).
1. In this new Customer interface, ask the agent something it doesn't understand (e.g. `I would like to book a flight`).
 The agent will ask for clarification.
1. Switch to the Operator interface. You will see that a second tab has appeared, representing the second customer.
Click this tab to view the conversation logs.
1. Switch back to the new Customer interface and enter another arbitrary statement (e.g. `I want to book a flight`). With
the agent unable to determine the customer's intent twice in a row, it will automatically escalate to an operator.

## Explanation
* The server communicates with the clients via Socket.IO. It initially sends all customer messages to Dialogflow
and returns the responses to the customer.
* The server monitors the `context` property of Dialogflow's response for a specific context named 'operator_request'.
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

### Part D: Creating your own implementation
You can modify this sample as a basis for your own implementation, but please be aware of the limitations expressed above.

When creating your own Dialogflow agent, you may wish to make use of the 
[Support prebuilt agent](https://console.dialogflow.com/api-client/#/agent//prebuiltAgents/Support). This agent provides a framework
for answering common support-related inquiries and providing a channel for users to contact you. 

## References and How to report bugs
* If you find any issues, please open a bug here on GitHub.
* Questions are answered on [StackOverflow](https://stackoverflow.com/questions/tagged/dialogflow).

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md.

## License
See LICENSE.md.

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).

