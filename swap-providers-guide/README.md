---
description: >-
  Follow this guide to deploy lnstxbridge client, join the aggregator and earn
  fees by providing liquidity for Lightning/Onchain BTC <-> Stacks trustless
  swaps.
---

# 📘 Swap Provider's Guide

## So you want to join the LNSwap Network?

With the activation of aggregator mode LNSwap.org - It is now possible for anyone run a lightweight app next to their Lightning node and earn swap fees for facilitating LN/onchain BTC and Stacks assets. Here's the [announcement thread on twitter](https://twitter.com/ln\_swap/status/1502869539427561473).

First decision you need to make is where you want to run the client app. If you're already running a full bitcoin node and LND node, you can skip to the [Deploy Client](deploy-client.md#backend-app) section.

{% hint style="info" %}
You can run your instance exclusively on [tor](https://www.torproject.org). By doing this you'll avoid the need to open ports on your router and all the dangers of running a publicly accessible server.
{% endhint %}

You can run your instance as long as **it's available 24/7**;

* On a VM from a cloud provider like [buyvm](https://buyvm.net), [hetzner](https://hetzner.com) or [linode](https://www.linode.com/?r=182ab8700d2894596a18aaf4431d0c13317c1d7f).
* On your own hardware like a self-hosted server like [raspiblitz](https://github.com/rootzoll/raspiblitz), [mynode](https://mynodebtc.com) or [umbrel](https://getumbrel.com).
* On any off the shelf laptop with a linux distribution.&#x20;

#### Minimum Hardware Requirements

|   CPU  | Memory |  Disk |
| :----: | :----: | :---: |
| 4 vCPU |   8GB  | 500GB |

> Note that these are tested & recommended values. It may be possible to run the client on a weaker hardware. Currently the bottleneck is likely the bitcoin & lightning node.&#x20;

