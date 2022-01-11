# 🚀 Quick Start

{% hint style="info" %}
**Note:** All swaps are trustless and there's no custody risk. However for reverse submarine swaps (STX -> LN) if the swap fails users will need to refund their coins by using the web interface at [https://www.lnswap.org/refund](https://www.lnswap.org).&#x20;
{% endhint %}

## No need for API keys&#x20;

You can integrate the library into your app and start making requests on mainnet right away. If you need help integrating/testing the widget, feel free to contact us.

LNSwap Discord: [https://discord.gg/8jGPCKmnnA](https://discord.gg/8jGPCKmnnA)

## Install the widget

The best way to interact with our API is to use the below code to make it available on your site:

{% tabs %}
{% tab title="JS" %}
```
<div id="root"></div>
<script src="https://lnswap-widget.vercel.app/widget.js"  
	id="LNSwap-Widget-Script" 
    data-config="{'name': 'lnswap', 'config': {'targetElementId': 'root'}}">
</script>
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**Good to know:** You can use the same script on any site. Just drop into your static page and `lnswap` function should be available globally or under `window.lnswap`
{% endhint %}

## Create your first swap request

To create your first swap request, populate the values below and call the `lnswap` function which will make the required call to LNSwap API.

{% hint style="warning" %}
**Heads up:** You can use any of the available methods. Please reach out to ensure that transactions will succeed for `Custodial Mint` as the `claim-for` contract call should conform to the expected trait.
{% endhint %}

Take a look at different swap types you can trigger using the widget:

{% tabs %}
{% tab title="Definition" %}
```
// Populate the required parameters and start the Swap
lnswap('swap', 
       'swapType', 
       'user stx address', 
       'amount in STX', 
       '(only for mintnft) NFT Contract Address',
       '(only for mintnft) NFT Mint Function Name');
```


{% endtab %}

{% tab title="Custodial Mint with Lightning" %}
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

{% tab title="LN->STX" %}
```python
// e.g. Trustless Swap Lightning to STX
lnswap('swap', 
       'reversesubmarine', 
       'ST27SD3H5TTZXPBFXHN1ZNMFJ3HNE2070QX7ZN4FF', 
       5);
```
{% endtab %}
{% endtabs %}
