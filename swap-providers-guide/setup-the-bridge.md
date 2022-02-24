# 3⃣ Setup the Bridge

## Backend App

LN-STX Bridge has very few requirements and can be installed by following below commands as detailed in the [github repository readme](https://github.com/pseudozach/lnstxbridge).

```
// clone the repo, install requirements and compile
git clone https://github.com/pseudozach/lnstxbridge.git
cd lnstxbridge && npm i && npm run compile

copy boltz.conf to ~/.lnstx/boltz.conf and modify as needed
start the app
npm run start
```

## Contracts

Each bridge instance should run its own swap contracts for both transparency purposes and to make it easy for the bridge backend to track the swaps.

Easiest way to deploy the swap contracts is to launch [explorer sandbox](https://explorer.stacks.co/sandbox/deploy), copy/paste contents of the [latest version of the contracts](https://github.com/pseudozach/lnstxbridge/tree/main/contracts) and click deploy!

{% hint style="info" %}
In the future it could be possible to run the bridge with a pruned node or by utilizing an external Stacks Node API but currently the most stable method is hosting all required nodes on the same server.
{% endhint %}

### Bitcoin

There are many ways to run a bitcoin node and even other implementations but this bridge uses the default reference implementation.

For security and verification purposes no download links are provided here. Instead it's recommended to visit the [official website](https://bitcoincore.org/en/download/), preferably [github repository](https://github.com/bitcoin/bitcoin) and always verify that the software downloaded is the one signed by bitcoin-core maintainers by checking the signatures.

```
// add bitcoin.conf
vim ~/.bitcoin/bitcoin.conf
testnet=0
server=1
daemon=1
txindex=1
zmqpubrawblock=tcp://127.0.0.1:28332
zmqpubrawtx=tcp://127.0.0.1:28333
rpcbind=127.0.0.1
rpcallowip=127.0.0.1/32

// unpack and run bitcoind
tar zxvf bitcoin-22.0-x86_64-linux-gnu.tar.gz
cd bitcoin-22.0/
bitcoind 
```

### Lightning

LND is one of many lightning implementations. There are plans to swap LND in the future with c-lightning but currently since it provides built-in `hold invoice` support it is the Lightning Network implementation that is being used in the bridge.

Visit [LND github repository](https://github.com/lightningnetwork/lnd/releases) releases page and download the latest supported version (as of now, v0.12.0-beta)

```
// add lnd.conf
vim ~/.lnd/lnd.conf
[Application Options]
externalip=xx.xx.xx.xx // public IP of your server
listen=localhost:9735
alias=<your optional alias>

// only if you have installed tor and want to run your lightning node on tor
[tor] 
tor.active=1
tor.v3=1

// unpack and run lnd
tar zxvf lnd-linux-amd64-v0.12.0-beta.tar.gz
cd lnd-linux-amd64-v0.12.0-beta
vim startlnd.sh
nohup ./lnd --bitcoin.active --bitcoin.mainnet --accept-keysend \
       --bitcoin.node=bitcoind &
chmod +x startlnd.sh
./startlnd.sh
```

{% hint style="info" %}
Remember to track logs and node status throughout the activity.

For instance you need to manually create or import a seed for LND. You can do so with `lncli create` or `lncli unlock` commands.
{% endhint %}

### Stacks

A full stacks node with websocket access is required for the bridge to function. In the future there may be other providers so this requirement is removed but as of now, stacks node is needed.

There's a quite straightforward way to jump-start it as detailed in this [repository](https://github.com/stacks-network/stacks-blockchain-docker).

```
// install docker-compose
VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | jq .name -r)
DESTINATION=/usr/local/bin/docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/${VERSION}/docker-compose-$(uname -s)-$(uname -m) -o $DESTINATION
sudo chmod 755 $DESTINATION

// clone stacks-blockchain container
git clone https://github.com/stacks-network/stacks-blockchain-docker && cd ./stacks-blockchain-docker

cp sample.env .env

./manage.sh mainnet pull
./manage.sh mainnet up
```

Once all nodes are started, it can take some hours until Bitcoin node synchronizes and reaches the chain tip. Stacks node can take multiple days. Be patient and regularly check with the below commands until all nodes are synchronized.

```
bitcoin-cli getblockchaininfo

curl -sL localhost:3999/v2/info | jq .
```
