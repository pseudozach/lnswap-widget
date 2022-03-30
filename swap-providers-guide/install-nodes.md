# 2⃣ Install Nodes

## Node Setup

LN-STX Bridge Client requires 2 nodes to function.&#x20;

* Bitcoin full node, unpruned and with tx-index enabled.
* LND lightning node

{% hint style="info" %}
Note that there are other methods to run Bitcoin and Lightning nodes including containerized versions. As long as the below configuration requirements are met and lnstxbridge-client can access the nodes, any installation method should be fine.

When in doubt, reach out to us on LNSwap Discord [#providers](https://discord.gg/zU2wwPjSXe) channel.
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

// if you are running provider client as a docker container add these
zmqpubrawblock=tcp://172.17.0.1:28332
zmqpubrawtx=tcp://172.17.0.1:28333
zmqpubhashtx=tcp://172.17.0.1:28333
zmqpubhashblock=tcp://172.17.0.1:28333
rpcbind=172.17.0.1
rpcallowip=172.0.0.0/8

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

// if you are running provider client as a docker container add this
rpclisten=172.17.0.1:10009

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
