# 3⃣ Deploy Client

## LN-STX Bridge Client App

There are a few methods to install the client app as documented in the [lnstxbridge-client repository readme](https://github.com/pseudozach/lnstxbridge-client/blob/main/README.md). Choose your preferred method based on your environment and technical expertise.

### Install with Script

Copy and Paste the below command into your umbrel/raspiblitz/mynode and follow the instructions.

```
bash <(curl -s https://cdn.jsdelivr.net/gh/pseudozach/lnstxbridge-client@main/install.sh)
```

This script will collect required environment variables from you and populate the docker-compose.yml before starting the docker lnstxbridge-client and [lnstxbridge-dashboard](https://github.com/pseudozach/lnstxbridge-dashboard) docker containers.

### Install with Docker Compose

```
git clone https://github.com/pseudozach/lnstxbridge-client
cd lnstxbridge-client/docker-compose/lnstx-client
```

Copy your LND certificate and admin macaroon to lnstx-client folder. Copy your bitcoin cookie file to lnstx-client folder.&#x20;

```
cp ~/.lnd/tls.cert docker-compose/lnstx-client/lnd-tls.cert
cp ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon docker-compose/lnstx-client/admin.macaroon  
cp ~/.bitcoin/.cookie docker-compose/lnstx-client/.cookie
```

{% hint style="warning" %}
Note that by copying these files into lnstxbridge-client docker container folder you are giving lnstxbridge-client admin access to your Bitcoin & LND node and allow it to generate/pay invoices, send/receive bitcoin on your behalf.
{% endhint %}

Modify the docker-compose.yml file and populate it with all of the required environment variables.

#### Configuration

Modify the boltz.conf file as per your requirements and environment.

```
cd lnstxbridge-client/docker-compose/lnstx-client
vim boltz.conf
```

Data in this file is mostly personal choice and depend on operator's environment. Feel free to join [#developers channel in our discord](https://discord.gg/8jGPCKmnnA) and ask if anything is unclear.

```
prepayMinerFee=true
# aggregatorUrl is the aggregator instance you're registering with.
aggregatorUrl="https://api.lnswap.org:9007"
# providerUrl needs to be set to your server IP or tor hidden service IP.
providerUrl="http://localhost:9008"

# Backend supports sending messages to Discord after successful and failed
# Swaps and if the wallet or channel balance is underneath a configurable threshold 
# 1. create a bot at https://discord.com/developers/applications
# 2. add the bot to any private channel in your discord server
# 3. give bot sendmessage access and copy/paste token here
[notification]
token = ""
channel = "secret-lnswapbot-channel"
prefix = "lns"
# Interval in minutes at which the wallet and channel balances should be checked 
interval = 10
# Some Discord commands (like withdraw) require a TOTP token
# This is the path to the secret of that TOTP token
otpsecretpath = "/home/workspace/.lnstx/otpSecret.dat"

# Backend supports balancing account funds via centralized exchange (currently OKCoin)
# Both automated and on-demand balancing is supported
[balancer]
apiUri = "https://www.okcoin.com"
apiKey = ""
secretKey = ""
passphrase = ""
tradePassword = ""
minSTX = 10
minBTC = 1000000
overshootPercentage = 0
autoBalance = false

[dashboard]
username = "admin"
password = "changeme!!!"

[[pairs]]
base = "BTC"
quote = "STX"
fee = 5
timeoutDelta = 1_240

# comment out to disable
# [[pairs]]
# base = "BTC"
# quote = "USDA"
# fee = 5
# timeoutDelta = 1_240

[[currencies]]
symbol = "BTC"
network = "bitcoinMainnet"
minChannelBalance = 1_000_000
minSwapAmount = 10_000
maxSwapAmount = 4_294_967
maxZeroConfAmount = 10_000_000
minLocalBalance = 1_000_000
minRemoteBalance = 1_000_000
minWalletBalance = 10_000_000
maxWalletBalance = 300_000

  [currencies.chain]
  host = "127.0.0.1"
  port = 8_332
  # cookie = "/root/.lnstx-client/.cookie"
  rpcuser = "kek"
  rpcpass = "kek"

  [currencies.lnd]
  host = "127.0.0.1"
  port = 10_009
  certpath = "/lnd/tls.cert"
  macaroonpath = "/lnd/data/chain/bitcoin/mainnet/admin.macaroon"

[stacks]
providerEndpoint = "https://stacks-node-api.mainnet.stacks.co"
stxSwapAddress = "SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.stxswap_v8"
sip10SwapAddress = "SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.sip10swap_v1"

  [[stacks.tokens]]
  symbol = "STX"
  maxSwapAmount = 1_294_967000
  minSwapAmount = 10000

  [[stacks.tokens]]
  symbol = "USDA"
  maxSwapAmount = 1_294_967000
  minSwapAmount = 10000
  contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token"
  decimals = 6
```

### Install from Source

```
// ensure you have node-14 installed

// clone the repo, install requirements and compile
git clone https://github.com/pseudozach/lnstxbridge-client.git
cd lnstxbridge-client && npm i && npm run compile
```

If you're running directly on linux/MacOS your data folder will be `~/.lnstx-client`

Copy boltz.conf there and populate it as explained in [configuration](deploy-client.md#configuration) section above.

```
mkdir -p ~/.lnstx-client
cp lnstxbridge-client/boltz.conf ~/.lnstx-client/boltz.conf
vim ~/.lnstx-client/boltz.conf

// once ready run it
cd lnstxbridge-client
npm run start
```

{% hint style="success" %}
It's suggested to use process managers like [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) because there can be many reasons your server might crash, restart and you should always try to ensure high uptime for your bridge.

You can also use an online monitoring tool like [cronitor](https://cronitor.io) or [uptime-kuma](https://github.com/louislam/uptime-kuma) to receive alerts if your instance goes down.
{% endhint %}
