# Software development project 2021

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A project by students in the Computer Science department of University of Helsinki.

### [DEMO](https://ohtup-staging.cs.helsinki.fi/trollbot)

## Description

An implementation of two chatbots for the purposes of a research that studies trolling on the internet.

## Implementation

Single page web application using Node.js and React.

## Installation

Read the README at backend folder.

Rasa: run `rasa train --domain domain` when you first pull the new directory to initialise the
Rasa model.

To start the Rasa action server (required for custom actions), run the command `rasa run actions`.

To start the Rasa HTTP API server, run the command `rasa run --enable-api --cors "*"`.

## Testing conversations in Rasa Shell

In backend folder:

Run backend with `npm start` (required for wikidata genre search).

In backend/rasa folder:

Use `rasa run actions` to run Rasa action server (required for custom actions).

Use `rasa shell` to test conversations on the command line.

You can also use `rasa test` to run the automated tests.
