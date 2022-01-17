function getConfig() {
    return {
        name: "LNSwap-Widget",
        apiUrl: "https://api.lnswap.org:9002",
        // apiUrl: "https://9002-pseudozach-lnstxbridge-c11co3n9dpn.ws-us27.gitpod.io",
        // apiUrl: "http://localhost:9002",
        mocknetUrl: "https://localhost:3999",
        // mocknetUrl: "https://3999-pseudozach-lnstxbridge-c11co3n9dpn.ws-us27.gitpod.io",
        pairId: "BTC/STX"
    }
}

export default getConfig();