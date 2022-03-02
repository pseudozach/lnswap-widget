function getConfig() {
    return {
        name: "LNSwap-Widget",
        // apiUrl: "https://api.lnswap.org:9002",
        // apiUrl: "https://9002-pseudozach-lnstxbridge-6ldqjy5d9y8.ws-us27.gitpod.io",
        apiUrl: "http://localhost:9002",
        mocknetUrl: "https://localhost:3999",
        // mocknetUrl: "https://3999-pseudozach-lnstxbridge-ymm436d4pnn.ws-us33.gitpod.io",
        pairId: "BTC/STX",
        triggerContractName: 'triggerswap-v4',
    }
}

export default getConfig();