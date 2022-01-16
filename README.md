# LNSwap Widget
This is a drop-in embeddable javascript widget that allows Stacks apps to accept Bitcoin Lightning on their websites via https://lnswap.org API.

# Overview
1. Host website includes the widget js on a static html page.
2. Host website triggers the swap widget by including required parameter e.g. user's address, swap amount etc.
3. User follows the instructions to pay with Bitcoin Lightning.
4. Swap is completed trustlessly, user does contract call on Stacks with a payment on Lightning.

## Demo
You can view a live demo on mainnet at https://widget.lnswap.org

## Documentation
Documentation on how the widget can be embedded and triggered can be found at https://docs.lnswap.org

# Running the Project
## Install dependencies
```
$ npm install
```
## Run the development server
```
$ npm run start
```
## Build the package
```
$ ./node_modules/.bin/webpack --config webpack.config.js
```
## Run Tests
```
$ Jest
```
## Mocknet Demo
* Set `mocknetURL` and `apiURL` in `src/config.js` to gitpod or other dummy values.

# Acknowledgments
* This widget is based on https://github.com/bjgrosse/simple-embeddable-react-widget  
* This work is funded by Stacks foundation with a grant.  
