# Simple PubSub Server

In software architecture, publish–subscribe is a messaging pattern where publishers categorize messages into classes that are received by subscribers. This is contrasted to the typical messaging pattern model where publishers send messages directly to subscribers.

Similarly, subscribers express interest in one or more classes and only receive messages that are of interest, without knowledge of which publishers, if any, there are.

Publish–subscribe is a sibling of the message queue paradigm, and is typically one part of a larger message-oriented middleware system. Most messaging systems support both the pub/sub and message queue models in their API; e.g., Java Message Service (JMS).

This pattern provides greater network scalability and a more dynamic network topology, with a resulting decreased flexibility to modify the publisher and the structure of the published data.

# Setup

You will need NodeJS version at least 8.0

When repo is cloned, run `npm install`. This will install all the necessary dependencies to run the server.

# Running Server

To run the server, simply type `npm run server`. This will compile the server.ts file to server.js and then be run by node. The server is hosted on localhost:42069 by default but can be hosted wherever you want by defining HOST and PORT as environment variables.

# Using the Server

To use the server as a client you need to use your languages relevant socket.io-client package (socket.io-client for JavaScript) and connect to the server on the host and port (default is localhost:42069) defined in environment variables HOST and PORT. Your client will automatically be registered on the server.

## Subscribing

To subscribe to a topic, you must send a message to the server in the form of `("subscribe", <topic>)`.
To unsubscribe you must send a message of the form `("unsubscribe", <topic>)`.
Once subscribed, all messages sent to the client with the header `"publish"` will be destined for you. In this message you can find the topic as the second part of the message and then an JSON as the third object.

# Message Formats

The message format has been constrained to:

-   Part 1: header ("publish")
-   Part 2: topic -> this is always a string
-   Part 3: message -> this is always JSON
