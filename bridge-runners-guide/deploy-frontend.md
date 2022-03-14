# 4⃣ Deploy Frontend

## Frontend App

Now that your bridge backend is ready, it's time to deploy a frontend and make it available to users.

{% hint style="info" %}
You can host your frontend in the same server as your backend, although this requires you to open another port, manage SSL certificates and possibly a web proxy like nginx.&#x20;

Current recommendation is to deploy to any react capable host. Simplest way is to use the 1-click deploy to vercel button found on the github repository and below.
{% endhint %}

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpseudozach%2Flnstxbridge-frontend\&env=REACT\_APP\_BOLTZ\_API,REACT\_APP\_BITCOIN\_LND,REACT\_APP\_BITCOIN\_LND\_ONION,REACT\_APP\_NETWORK,REACT\_APP\_STACKS\_NETWORK\_TYPE\&envDescription=lnstxbridge%20and%20node%20details\&envLink=https%3A%2F%2Fgithub.com%2Fpseudozach%2Flnstxbridge-frontend%2Fblob%2Fmain%2F.env)

If you want to run the app on a VM, here are the instructions:

```
// clone the repo and install requirements
git clone https://github.com/pseudozach/lnstxbridge-frontend.git
cd lnstxbridge-frontend && npm i

// make required changes as per your environment to .env file

// start the app
npm run start
```

## Dashboard

In order to help swap providers, help make it easier to run the bridge and increase visibility into the day to day operation there's now an [admin dashboard](https://github.com/pseudozach/lnstxbridge-dashboard) that shows signer funds, swaps and balance status.

This dashboard is also open source and deployable with 1-click.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpseudozach%2Flnstxbridge-dashboard\&env=NEXT\_PUBLIC\_BACKEND\_URL\&envDescription=URL%20of%20LN-STX%20Bridge%20Backend)

![Bridge Admin Dashboard](<../.gitbook/assets/Screen Shot 2022-02-24 at 3.07.34 PM.png>)

## 🎉 You are live in production!&#x20;

Congratulations if you've made it this far. You are part of a global liquidity network that allows peers to exchange value with each other in a completely trustless and permissionless way.

{% hint style="success" %}
Enjoy earning fees on your bridge!

[Get in touch](https://discord.gg/8jGPCKmnnA) for any issues, feedback or suggestions regarding any of the lnstxbridge software components or this guide.
{% endhint %}
