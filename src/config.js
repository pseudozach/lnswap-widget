function getConfig() {
    return {
        name: "LNSwap-Widget",
        apiUrl: "https://api.lnswap.org:9007",
        // apiUrl: "https://9007-pseudozach-lnstxbridge-xa92ji3mv8l.ws-us44.gitpod.io",
        // apiUrl: "http://localhost:9007",
        mocknetUrl: "http://localhost:3999",
        // mocknetUrl: "https://3999-pseudozach-lnstxbridge-xa92ji3mv8l.ws-us44.gitpod.io",
        pairId: "BTC/STX",
        triggerContractName: 'triggerswap-v6',
    }
}

export default getConfig();