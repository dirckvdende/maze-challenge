
# Maze Challenge

A small agent-based challenge to reach the goal of a maze using as little memory as possible. Some of the test cases contain loops, making "hugging the left/right wall" unviable. The challenge is available online:

[Try the challenge](https://dirck.dev/maze-challenge/)

## Modifying the code

The application can be run locally using node.js. First install the dependencies by navigating to the project folder using
```sh
npm install
```
During development you can use the following command, which automatially looks for file changes and hosts an HTTP server to [http://localhost:8000/](http://localhost:8000/):
```sh
npm run watch
```
Press Ctrl+C to stop watching and close the HTTP server.

### Project structure

This project contains an [index.html](./index.html) file, which is the only webpage. The [src/scss](./src/scss/) folder contains all styling and the [src/ts](./src/ts/) folder contains scripts. The [index.mts](./src/ts/index.mts) script is run on page load.
