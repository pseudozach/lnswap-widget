# 🚀 Quick Start

{% hint style="success" %}
All swaps (except Custodial Mint) are trustless and there's no risk to user funds. If user navigates away from the page or swap fails for any reason, user's Lightning invoice payment will be canceled in \~24 hours and their funds will return to their Lightning wallet.
{% endhint %}

## No need for API keys&#x20;

You can integrate the library into your app and start making requests on mainnet right away. If you need help integrating or testing the widget, feel free to contact us.

Discord: [https://discord.gg/8jGPCKmnnA](https://discord.gg/8jGPCKmnnA)

Twitter: [https://twitter.com/ln\_swap](https://twitter.com/ln\_swap)

Email: [lnswap@pseudozach.com](mailto:lnswap@pseudozach.com)

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
**Heads up:** If you plan to use `Custodial Mint` please reach out to ensure that transactions will succeed as the `claim-for` contract call should conform to the expected trait.

Here's a sample NFT contract: [https://explorer.stacks.co/txid/SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.stacks-roots-v2?chain=mainnet](https://explorer.stacks.co/txid/SP2507VNQZC9VBXM7X7KB4SF4QJDJRSWHG4V39WPY.stacks-roots-v2?chain=mainnet)
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
       '(only for mintnft/triggerswap) NFT Contract Address',
       '(only for mintnft) NFT Mint Function Name',
       'sponsored transaction'
       '(only for triggertransferswap) receiver stx address');
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
       'ST1GH2VFAZ7ZB02JHBTMJSQYKJ83ESCNBZ0PJ4MMQ');
```
{% endtab %}

{% tab title="Custodial Mint with LN" %}
```javascript
// e.g. (Custodial) Mint NFT with Lightning 
lnswap('swap', 
       'mintnft', 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF', 
       25, 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF.stacks-roots-v2',
       'claim-for');
```
{% endtab %}
{% endtabs %}
