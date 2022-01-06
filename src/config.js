function getConfig() {
    return {
        name: "LNSwap-Widget",
        apiUrl: "https://api.lnswap.org:9002",
        // apiUrl: "https://9002-plum-guppy-65d1lt31.ws-us25.gitpod.io",
        // apiUrl: "http://localhost:9002",
        // mocknetUrl: "https://localhost:3999",
        mocknetUrl: "https://3999-plum-guppy-65d1lt31.ws-us25.gitpod.io",
        pairId: "BTC/STX"
    }
}

export default getConfig();