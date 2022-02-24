---
description: >-
  Follow this guide to deploy your own Lightning/Onchain BTC <-> Stacks
  trustless bridge.
---

# 📘 Swap Provider's Guide

## Where to run your bridge?

First decision you need to make is to identify a host for your app. Due to LN-STX Bridge's architecture, currently the app needs to be run on a publicly reachable server with a domain name.

{% hint style="info" %}
You can run your instance exclusively on [tor](https://www.torproject.org), this way you would not need to purchase and configure a domain name.

Downside is, your users would need to reach your instance over tor network.
{% endhint %}

You can choose to run your instance;

* On a VM from a cloud provider like [buyvm](https://buyvm.net), [hetzner](https://hetzner.com) or [linode](https://www.linode.com/?r=182ab8700d2894596a18aaf4431d0c13317c1d7f).
* On your own hardware like a self-hosted server like [raspiblitz](https://github.com/rootzoll/raspiblitz), [mynode](https://mynodebtc.com) or [umbrel](https://getumbrel.com).

#### Minimum Hardware Requirements

|   CPU  | Memory |  Disk |
| :----: | :----: | :---: |
| 4 vCPU |   8GB  | 500GB |

> Note that work is underway to develop a simplified [lnstxbridge-client](https://github.com/pseudozach/lnstxbridge-client) that anyone can deploy on their self-hosted bitcoin/lightning node. This should reduce hardware requirements significantly.

