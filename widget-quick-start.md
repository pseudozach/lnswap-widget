# 🚀 Widget Quick Start

{% hint style="success" %}
All swaps are trustless and there's no risk to user funds. If user navigates away from the page or swap fails for any reason, user's Lightning invoice payment will be canceled in \~24 hours and their funds will return to their Lightning wallet.
{% endhint %}

## No need for API keys&#x20;

You can integrate the library into your app and start making requests on mainnet right away. If you need help integrating or testing the widget, feel free to contact us.

Discord: [https://discord.gg/8jGPCKmnnA](https://discord.gg/8jGPCKmnnA)

Twitter: [https://twitter.com/ln\_swap](https://twitter.com/ln\_swap)

Email: [hi@lnswap.org](mailto:hi@lnswap.org)

## Install the widget

The best way to interact with our API is to use the below code to make it available on your site:

{% tabs %}
{% tab title="JS" %}
```
<div id="root"></div>
<script src="https://widget.lnswap.org/widget.js"  
	id="LNSwap-Widget-Script" 
    data-config="{'name': 'lnswap', 'config': {'targetElementId': 'root'}}">
</script>
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**Note:** You can use the same script on any site. Just drop into your static page and `lnswap` function should be available globally or under `window.lnswap`
{% endhint %}

## Create your first swap request

To create your first swap request, populate the values below and call the `lnswap` function which will make the required call to LNSwap API.

{% hint style="warning" %}
**How it works:** Stacks contract calls are triggered when required STX (or SIP10) is locked into the [swap contract](https://explorer.stacks.co/txid/SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.stxswap\_v10?chain=mainnet) and once it's confirmed, user calls one of the `trigger` calls that can be found in the triggerswap contract.

Here's the latest triggerswap contract: [https://explorer.stacks.co/txid/SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.triggerswap-v6?chain=mainnet](https://explorer.stacks.co/txid/SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.triggerswap-v5?chain=mainnet)
{% endhint %}

Take a look at different swap types you can trigger using the widget:

{% tabs %}
{% tab title="Generic" %}
```javascript
// Populate the required parameters and start the Swap
lnswap('swap', 
       'swapType', 
       'user stx address', 
       'amount in STX', 
       '(only for mintnft/triggerswap/trustless rewards) NFT/Game Contract Address',
       '(only for mintnft) NFT Mint Function Name',
       'sponsored transaction'
       '(only for triggertransferswap) receiver stx address',
       '(only for triggertransferswap) stx transfer memo',
       '(only for trustless rewards) array of required parameters');
```


{% endtab %}

{% tab title="LN->STX" %}
```javascript
// e.g. Trustlessly Swap Lightning to STX
lnswap('swap', 
       'reversesubmarine', 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF', 
       5);
```
{% endtab %}

{% tab title="Mint with LN" %}
```javascript
// e.g. (Non-Custodial) Mint NFT with Lightning 
lnswap('swap', 
       'triggerswap', 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF', 
       25, 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF.stacks-roots-v2',
       'claim',
       'true');
```
{% endtab %}

{% tab title="Send STX with LN" %}
```javascript
// e.g. Send STX with Lightning 
lnswap('swap', 
       'triggertransferswap', 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF',
       25, 
       '',
       '',
       'false',
       'ST1GH2VFAZ7ZB02JHBTMJSQYKJ83ESCNBZ0PJ4MMQ',
       'test memo description');
```
{% endtab %}

{% tab title="Trustless Rewards" %}
```javascript
// e.g. Create or Join a Stacks Degens Race
lnswap('swap', 
       'sdcreategame', // or sdjoingame 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF', 
       25, 
       'ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK.trustless-rewards',
       '',
       'false',
       '',
       '',
       [description, price, factor, commission, mapy, length, traffic, curves, hours); // [id] for sdjoingame
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Note that you can listen to widget updates from the host page via [cross-origin communications](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
{% endhint %}

```javascript
// listen to swap events from the widget
window.onmessage = function(e) {
    if (e.data && e.data.target && e.data.target === 'lnswap') {
        console.log('received data from lnswap widget: ', e.data.data);
    }
};

// data will be in below format:
{   target: 'lnswap', 
    data: {
        txId: 'Stacks txid if exists', 
        swapId: 'ID of the Swap', 
        status: 'Status of the swap'
    }
}
```
