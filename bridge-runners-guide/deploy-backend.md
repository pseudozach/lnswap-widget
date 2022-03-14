# 3⃣ Deploy Backend

## Backend App

LN-STX Bridge has very few requirements and can be installed by running below commands as detailed in the [github repository readme](https://github.com/pseudozach/lnstxbridge).

```
// ensure you have node-14 installed

// clone the repo, install requirements and compile
git clone https://github.com/pseudozach/lnstxbridge.git
cd lnstxbridge && npm i && npm run compile
```

{% hint style="warning" %}
Note that in order to start the app and serve swaps, there are still many requirements like opening Lightning channels from your node and funding the swap provider `signer` account with STX and BTC funds.
{% endhint %}

## Contracts

Each bridge instance should run its own swap contracts for both transparency purposes and to make it easy for the bridge backend to track the swaps.

Easiest way to deploy the swap contracts is to launch [explorer sandbox](https://explorer.stacks.co/sandbox/deploy), copy/paste contents of the [latest version of the contracts](https://github.com/pseudozach/lnstxbridge/tree/main/contracts) and click deploy!

## Signer Account

As a swap provider, lnstxbridge will need access to private keys for a stacks account that has STX (and any other SIP10 you plan to serve).

Generate a new stacks account using any available method ([hiro wallet](https://www.hiro.so/wallet) or [stx cli](https://github.com/hirosystems/stacks.js/tree/master/packages/cli#make\_keychain)) send STX funds into this account and place the mnemonic seed of this account on the server at `~/.lnstx/seed.dat`

## Configuration

Once the app is ready and contracts are deployed, it's time to build the configuration file that feeds this data to the app.

Data in this file is mostly personal choice and depend on operator's environment. Feel free to join [#developers channel in our discord](https://discord.gg/8jGPCKmnnA) and ask if anything is unclear.

```
vim ~/.lnstx/boltz.conf

# required if you want to enable sponsored transactions
prepayMinerFee=true

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
password = "admin"

[[pairs]]
base = "BTC"
quote = "STX"
fee = 5
timeoutDelta = 1_240

# if you do not want to serve USDA sip10 token swaps, you can delete this pair
[[pairs]]
base = "BTC"
quote = "USDA"
fee = 5
timeoutDelta = 1_240

[[currencies]]
symbol = "BTC"
network = "bitcoinRegtest"
minWalletBalance = 10_000_000
minChannelBalance = 10_000_000
maxSwapAmount = 4_294_967
minSwapAmount = 10_000
maxZeroConfAmount = 10_000_000

  [currencies.chain]
  host = "127.0.0.1"
  port = 18_443
  cookie = "docker/regtest/data/core/cookies/.bitcoin-cookie"
  rpcuser = "kek"
  rpcpass = "kek"

  [currencies.lnd]
  host = "127.0.0.1"
  port = 10_009
  certpath = "docker/regtest/data/lnd/certificates/tls.cert"
  macaroonpath = "docker/regtest/data/lnd/macaroons/admin.macaroon"

[stacks]
providerEndpoint = "http://localhost:3999"
# you need to replace these contract addresses 
# with the ones you have deployed in the previous step.
stxSwapAddress = "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK.stxswap_v8"
sip10SwapAddress = "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK.sip10swap_v1"

  [[stacks.tokens]]
  symbol = "STX"
  maxSwapAmount = 1_294_967000
  minSwapAmount = 10000

# if you are serving another SIP10 token you can replace/add below lines
  [[stacks.tokens]]
  symbol = "USDA"

  maxSwapAmount = 1_294_967000
  minSwapAmount = 10000
  contractAddress = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token"
  decimals = 6
```

## Ready to Launch!

Now that you've prepared all the requirements you can deploy your backend!

```
cd lnstxbridge
npm run start
```

{% hint style="success" %}
It's suggested to use process managers like [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) because there can be many reasons your server might crash, restart and you should always try to ensure high uptime for your bridge.

You can also use an online monitoring tool like [cronitor](https://cronitor.io) or [uptime-kuma](https://github.com/louislam/uptime-kuma) to receive alerts if your instance goes down.
{% endhint %}
