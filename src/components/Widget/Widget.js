import React from 'react'
import ReactDOM from 'react-dom';
// import Modal from 'react-modal';
import Config from '../../config';
import './Widget.css';
// import sha256 from 'crypto-js/sha256';
import { crypto } from 'bitcoinjs-lib';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import QRCode from "react-qr-code";
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import LockIcon from '@mui/icons-material/Lock';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { OpenInNew } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import lightningPayReq from 'bolt11';

import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import {
  bufferCV,
  uintCV,
  noneCV,
  contractPrincipalCV,
  standardPrincipalCV,
  // makeStandardSTXPostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  createAssetInfo,
  makeContractNonFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  stringAsciiCV,
  PostConditionMode,
  // createSTXPostCondition,
  // parsePrincipalString,
  // StacksMessageType,
  // PostConditionType
  makeContractSTXPostCondition,
  createContractPrincipal,
  parsePrincipalString,
  StacksMessageType,
  PostConditionType,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';

// import bigInt from 'big-integer';
// import { BN } from 'bn.js';

let mocknet = new StacksMocknet({url: Config.mocknetUrl});
// 
// mocknet.coreApiUrl = 'http://localhost:3999';
// mocknet.coreApiUrl = 'https://3999-azure-cricket-glgzsgrt.ws-us17.gitpod.io'
const testnet = new StacksTestnet();
const mainnet = new StacksMainnet();
let activeNetwork = mocknet

// let stacksNetworkType = "mocknet";
if(Config.apiUrl.includes("api.lnswap")){
    // console.log('network is mainnet')
    activeNetwork = mainnet
} else if(Config.apiUrl.includes("testnet")) {
    // console.log('network is testnet')
    activeNetwork = testnet
} else {
    // if(Config.apiUrl.includes("gitpod") || Config.apiUrl.includes("localhost"))
    // console.log('network is mocknet ', mocknet, Config.mocknetUrl)
    activeNetwork = mocknet
}
console.log('activeNetwork: ', Config.mocknetUrl, activeNetwork);

//  else {
//     console.log('network is testnet')
//   activeNetwork = testnet
// }
// console.log('widget network: ', Config.mocknetUrl, Config.apiUrl, activeNetwork)

//////////////////////////////////
// danger!!! use only for testing
// LOGOUT USER - FORCE LOGIN   //
// const appConfig = new AppConfig(['store_write', 'publish_data']);
// let userSession = new UserSession({ appConfig });
// userSession.signUserOut();
//////////////////////////////////

const widgetName = Config.name;
const apiUrl = Config.apiUrl;
const pairId = Config.pairId;

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    }
  };

  const style = {
    // position: 'absolute',
    // top: '40%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    // border: '1px solid #000',
    boxShadow: 24,
    // p: 4,
    width: 'fit-content',
    borderRadius: 2,
    outline: 'none !important',
  };

  const nounderline = {
      textDecoration: "none",
  }

  const scrollModalStyle = {
    position:'absolute',
    top:'10%',
    left:'10%',
    overflow:'scroll',
    height:'100%',
    display:'block',
    maxHeight: '90%',
  }

  const centeredView = {
    display: 'flex',
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
    paddingTop: 2,
    borderRadius: 8,
    overflow: 'auto',

    display: 'flex',
    flex: '1 1 0%',
    justifyContent: 'space-between',
    alignContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column',
  }
  const modalView = {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }

  const randomBytes = size => {
    const bytes = Buffer.allocUnsafe(size);
    global.crypto.getRandomValues(bytes);
  
    return bytes;
  };

class Widget extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            message: [],
            modalIsOpen: false,
            claimAddress: '',
            invoiceAmount: 0,
            invoiceAmountBTC: '...',
            preimage: '',
            preimageHash: '',
            rate: '30000',
            fee: '5',
            paymentLink: 'invoice',
            showLoading: true,
            showButton: false,
            swapId: '-',
            swapObj: {},
            invoice: '',
            showStatus: false,
            swapStatus: '',
            statusColor: 'success',
            buttonText: 'Claim',
            showQr: true,
            buttonLoading: false,
            showComplete: false,
            showCopyTooltip: false,
            swapType: '',
            nftAddress: '',
            contractSignature: 'claim',
            stxAmount: 0,
            stxAmountLarge: 0,
            headerText: 'Preparing Swap...',
            txId: '',
            triggerContractName: Config.triggerContractName,
            sponsoredTx: false,
            minerFeeInvoice: '',
            minerPaymentLink: '',
            minerFeePaid: false,
            // explorerLink: '',
            receiverAddress: '',
            presigned: false,
        };
    }

    render() {
        if (this.state.modalIsOpen) {
            return (
                <Modal
                open={this.state.modalIsOpen}
                onClose={this.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={centeredView}
                disableEscapeKeyDown={true}
                >
                    <Box sx={style}>
                        {/* <View sx={{backgroundColor: 'black', height: 20}}>

                        </View> */}
                        <Paper elevation={0} sx={{backgroundColor: '#f8f4fc', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, position: 'relative',}}>
                            <img src="https://widget.lnswap.org/assets/btc.svg" height='32' style={{marginRight:24, position: 'absolute', zIndex: 21,}}/>
                            <img src="https://widget.lnswap.org/assets/stx.svg" height='32' style={{marginLeft:24}}/>
                            <IconButton
                                aria-label="close"
                                onClick={this.handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                                >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </Paper>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', mt: 2 }}>
                            {this.state.headerText}
                        </Typography>
                        <Typography id="modal-modal-description" variant="body1" sx={{ mb: 2, mx: 2, fontWeight: 100, textAlign: 'center', }}>
                        Confirm details and pay the LN invoice to start the swap.
                        </Typography>
                        <Divider sx={{ mb:2 }} />
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' }, display: 'inline-flex', px:4
                            }}
                            noValidate
                            autoComplete="off"
                            >
                                <TextField
                                    disabled
                                    sx={{ m: 1, width: '25ch', input: {
                                        "-webkit-text-fill-color": `black !important`,
                                        color: `black !important`,
                                    },}}
                                    id="input-rate"
                                    label={pairId + " Rate"}
                                    value={this.state.rate}
                                />
                                {/* <FormControl variant="standard">
                                    <InputLabel htmlFor="input-rate">
                                        {pairId + " Rate"}
                                    </InputLabel>
                                    
                                </FormControl> */}
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', input: {
                                "-webkit-text-fill-color": `black !important`,
                                color: `black !important`,
                            },}}
                            id="outlined-required"
                            label="Fee"
                            value={this.state.fee}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                            />
                        </Box>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' }, px:4
                            }}
                            noValidate
                            autoComplete="off"
                            >
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', input: {
                                "-webkit-text-fill-color": `black !important`,
                                color: `black !important`,
                            },}}
                            id="outlined-required"
                            label="Send"
                            value={this.state.invoiceAmountBTC}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                        <img src="https://widget.lnswap.org/assets/btc.svg" height='16' style={{ marginRight:4 }}/>BTC
                                    </InputAdornment>,
                                }}
                            />
                            {/* <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', }}
                            id="outlined-required"
                            label="Amount To Pay"
                            value={this.state.invoiceAmount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">sats - ฿</InputAdornment>,
                                }}
                            /> */}
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', input: {
                                "-webkit-text-fill-color": `black !important`,
                                color: `black !important`,
                            },}}
                            id="outlined-required"
                            label="Receive"
                            value={this.state.stxAmount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <img src="https://widget.lnswap.org/assets/stx.svg" height='16' style={{ marginRight:4 }}/>STX</InputAdornment>,
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                mx: 'auto',
                                // bgcolor: 'primary.main',
                                // color: '#fff',
                                // width: 200,
                                px:4,
                                // m: 1,
                                // borderRadius: 1,
                                textAlign: 'center',
                            }}
                            >
                            {this.state.sponsoredTx && this.state.minerFeeInvoice && !this.state.minerFeePaid ? (
                                <>
                                    <Box sx={{backgroundColor: '#f8f4fc', p:2, mx:1, borderRadius: 2}}>
                                        <a href={this.state.minerPaymentLink}>
                                        <QRCode 
                                            value={this.state.minerFeeInvoice} 
                                        /></a>
                                    </Box>
                                    <Box sx={{ my: 1, mx:1,  cursor: 'pointer'}} fullWidth>
                                        <Tooltip open={this.state.showCopyTooltip} title="Copied">
                                            <TextField 
                                                disabled 
                                                fullWidth
                                                size="small"
                                                variant="outlined" 
                                                value={this.state.minerFeeInvoice} 
                                                maxRows={1} 
                                                onClick={this.copyToClipboardMinerFee}
                                                sx={{ cursor: 'pointer', input: {
                                                    "-webkit-text-fill-color": `black !important`,
                                                    color: `black !important`,
                                                },}}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"><ContentCopyIcon style={{color: 'black'}}/></InputAdornment>,
                                                    style: { cursor: 'pointer' }
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>
                                </>
                            ) : null}
                            {(!this.state.sponsoredTx || this.state.minerFeePaid) && this.state.showQr ? (
                                <>
                                <Box sx={{backgroundColor: '#f8f4fc', p:2, mx:1, borderRadius: 2, display: 'flex', justifyContent: 'space-around',}}>
                                    <a href={this.state.paymentLink}>
                                    <QRCode 
                                        value={this.state.invoice} 
                                    /></a>
                                </Box>
                                <Box sx={{ my: 1, mx:1,  cursor: 'pointer'}} fullWidth>
                                    <Tooltip open={this.state.showCopyTooltip} title="Copied">
                                        <TextField 
                                            disabled 
                                            fullWidth
                                            size="small"
                                            variant="outlined" 
                                            value={this.state.invoice} 
                                            maxRows={1} 
                                            onClick={this.copyToClipboard}
                                            sx={{ cursor: 'pointer', input: {
                                                "-webkit-text-fill-color": `black !important`,
                                                color: `black !important`,
                                            },}}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end"><ContentCopyIcon style={{color: 'black'}}/></InputAdornment>,
                                                style: { cursor: 'pointer' }
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                                </>
                            ) : null}

                            {this.state.showStatus ? (
                                <Paper variant="outlined" sx={{backgroundColor: '#f8f4fc', m:1, py:1, mb:2, display: 'flex', }} fullWidth>
                                    {/* fontSize="large" sx={{ fontSize: '5em'}} */}
                                    {this.state.swapStatus.includes("lock") ? (<LockIcon color="secondary" fontSize="large" sx={{m:1, fontSize: 36}}/>) : null}
                                    {(this.state.swapStatus.includes("fail") || this.state.swapStatus.includes("Unable to reach")) ? (<CancelIcon color="error" fontSize="large" sx={{m:1, fontSize: 36}} />) : null}
                                    {this.state.swapStatus.includes("This invoice is ") ? (<InfoIcon color="info" fontSize="large" sx={{m:1, fontSize: 36}} />) : null}
                                    {this.state.showComplete ? (
                                        <CheckCircleIcon color="success" fontSize="large" sx={{m:1, fontSize: 36}} />
                                    ) : null}
                                    <Typography variant="body1" gutterBottom component="div" sx={{ mx: 'auto', textAlign: 'center', display: 'flex', alignItems: 'center', marginBottom: 0, }} color={this.state.statusColor}>
                                        {this.state.swapStatus}
                                    </Typography>
                                </Paper>
                            ) : null}
                            {(this.state.showStatus && (this.state.swapStatus.includes("locking") || this.state.swapStatus.includes("Claiming") || this.state.swapStatus.includes("NFT in your wallet"))) ? (
                                <Paper variant="outlined" sx={{backgroundColor: '#f8f4fc', m:1, py:1, mb:2, display: 'flex', }} fullWidth>
                                    <Typography variant="caption" gutterBottom component="div" sx={{ mx: 'auto', textAlign: 'center', display: 'flex', alignItems: 'center', marginBottom: 0, wordWrap: "break-word",  }} color={this.state.statusColor}>
                                    {this.state.swapStatus.includes("locking") ? '* Please wait, this could take approx. 10 minutes.' : '* You can safely close this window.'}
                                </Typography>
                                </Paper>
                            ) : null}
                            {this.state.txId ? (
                                    <Button variant="outlined" color="secondary" sx={{mt:1}} endIcon={<OpenInNew style={{color: 'black'}}/>} href={`https://explorer.stacks.co/txid/${this.state.txId}?chain=${this.isTestnet() ? `testnet` : `mainnet`}`} target="_blank">
                                      View on Stacks Explorer
                                    </Button>
                                // <a href={`https://explorer.stacks.co/txid/${this.state.txId}?chain=mainnet`} target="_blank">
                                //     <Typography variant="body1" gutterBottom component="div" sx={{ mx: 'auto', textAlign: 'center' }} color={this.state.statusColor}>
                                //     View on Stacks Explorer
                                //     </Typography>
                                // </a>
                            ) : null}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {this.state.showLoading ? (<CircularProgress sx={{ mx: 'auto', textAlign: 'center', display: 'block', margin: 'auto' }} />) : null}
                        {this.state.showButton ? (
                            <Box
                                sx={{px: 5,textAlign: 'center',}}>
                                <LoadingButton
                                    fullWidth
                                    sx={{ }}
                                    onClick={this.connectStacksWallet}
                                    // endIcon={<SendIcon />}
                                    loading={this.state.buttonLoading}
                                    loadingPosition="end"
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                >
                                {this.state.buttonText}
                                </LoadingButton>
                            </Box>
                        ) :  null}
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch', color: 'gray' }, m:3,
                            }}
                            noValidate
                            autoComplete="off"
                            >
                            <Typography 
                                variant="caption" 
                                display="block" 
                                gutterBottom
                                sx={{ float: 'left', mb:1, color: 'gray'  }}
                            >
                                Swap ID: {this.state.swapId}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                display="block" 
                                gutterBottom
                                sx={{ float: 'right', mb:1, color: 'gray'  }}
                            >
                                powered by <a href="https://LNSwap.org" target="_blank" style={nounderline}>LNSwap.org</a>
                            </Typography>
                        </Box>
                    </Box>
                </Modal>

            );
        }
        else {
            return (
                // <div className="widget-container">
                //     <h1>I'm a {widgetName}</h1>
                // </div>
                null
            );
        }
    }

    // componentDidMount = () => {
    //     this.getpairs();
    // }

    connectStacksWallet = async () => {
        const appConfig = new AppConfig(['store_write', 'publish_data']);
        let userSession = new UserSession({ appConfig });
        let thisthing = this;
        // console.log("connectStacksWallet, ", userSession);
        if(userSession.isUserSignedIn()) {
            let userData = userSession.loadUserData();
            console.log(`userData: `, userData);
            console.log(`checking swaptype: `, this.state.swapType);
            switch (this.state.swapType) {
                case 'reversesubmarine':
                    this.claimStx();
                    break;
                
                case 'triggerswap':
                    this.triggerStx();
                    break;

                case 'triggertransferswap':
                    this.triggerTransferStx();
                    break;

                case 'sdcreategame':
                case 'sdjoingame':
                    this.triggerTrustlessRewards();
                    break;

                case 'stacking':
                    this.triggerStacking();
                    break;

                default:    
                    console.log(`swapType not found `, this.state.swapType)
                    break;
            }
          
        } else {
            console.log(`user not logged in!!!`);
            showConnect({
                appDetails: {
                    name: 'LNSwap',
                    icon: 'https://lnswap.org/favicon.ico',
                },
                // redirectTo: '/',
                onFinish: () => {
                    // window.location.reload();
                    // thisthing.claimStx();
                    // console.log(`connect finished`);
                    thisthing.setState({buttonText: 'Claim'});
                    window.top.postMessage({target: 'lnswap', data: {status: 'Wallet connected'}}, '*')
                },
                userSession: userSession,
            }); 
        }
    }    
    copyToClipboard = () => {
        if(!navigator.clipboard) return;
        let thisthing = this;
        navigator.clipboard.writeText(this.state.invoice);
        this.setState({showCopyTooltip: true});
        setTimeout(() => {
            thisthing.setState({showCopyTooltip: false});
        }, 1000);
    }
    copyToClipboardMinerFee = () => {
        if(!navigator.clipboard) return;
        let thisthing = this;
        navigator.clipboard.writeText(this.state.minerFeeInvoice);
        this.setState({showCopyTooltip: true});
        setTimeout(() => {
            thisthing.setState({showCopyTooltip: false});
        }, 1000);
    }
    handleClick = () => {
        this.setState({buttonLoading: true,});
    }
    handleClose = (event, reason) => {
        // console.log(`handleClose `, event, reason);
        if (reason && reason == "backdropClick") 
        return;
        this.setState({modalIsOpen: false});
    }
    resetState = () => {
        this.setState({txId:'', swapStatus: '', showComplete: false, buttonLoading: false, minerFeePaid: false, showButton: false,}); 
    }
    createSecret = () => {
        // generate one-time-use preimage/preimageHash
        const preimage = randomBytes(32);
        // console.log(`preimage: ${preimage.toString('hex')}`);
        const preimageHash = crypto.sha256(preimage);
        // console.log(`preimageHash: ${preimageHash}`);
        
        // let userSession = new UserSession({ appConfig });
        // let claimButtonText = 'Claim';
        // if(!userSession.isUserSignedIn()) {
        //     claimButtonText = 'Connect';
        // }
        // , buttonText: claimButtonText
        
        this.setState({preimage: preimage.toString('hex'), preimageHash: preimageHash.toString('hex'), showLoading: true, showStatus: false, swapStatus: ''});
        // this.createswap();
    }
    setMessage = (...message) => {
        if(!message[0] || !message[1] || !message[2]) {
            throw Error(`Missing required swap parameter(s)!`);
        }
        console.log(`swapParams: `, message)
        let headerText;
        if(message[0] === 'reversesubmarine' || message[0] === 'triggertransferswap') {
            headerText = 'Send BTC, Receive STX'
        } else if(message[0] === 'sdcreategame' || message[0] === 'sdjoingame') {  
            headerText = 'Trustless Rewards'
        } else if(message[0] === 'stacking') {  
            headerText = 'Send BTC, Stack STX'
        } else {
            headerText = 'Send BTC, Receive NFT'
        }
        // lnswap('swap', 'mintnft', stxaddress, stxamount, contractAddress, contractSignature);
        this.setState({
            swapType: message[0], 
            claimAddress: message[1], 
            stxAmount: parseFloat(message[2]), 
            stxAmountLarge: parseFloat(Math.round(message[2]*10**8)), 
            contractAddress: message[3], 
            contractSignature: message[4], 
            sponsoredTx: message[5] === "true" || message[5] === true, 
            receiverAddress: message[6] || "",
            stxMemo: message[7] || "",
            callParameters: message[8] || [],
            headerText,
            modalIsOpen: true
        });
        this.getpairs();
    }
    getpairs = () => {
        fetch(`${apiUrl}/getpairs`, {
            method: 'get',
            // mode: 'no-cors',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            }).then(res => res.json())
            .then(res => {
                // console.log("getpairs: ", res);
                const rate = parseInt(res.pairs[pairId].rate);
                const maxLimit = res.pairs[pairId].limits.maximal;
                const minLimit = res.pairs[pairId].limits.minimal;
                const fee = res.pairs[pairId].fees.percentage;
                const targetStxAmount = (100*this.state.stxAmount)/(100-fee);
                // const invoiceAmount = parseInt((this.state.stxAmount / rate) * 100000000 * (1+(fee/100)) );
                const invoiceAmount = Math.ceil((targetStxAmount / rate) * 100000000);
                const invoiceAmountBTC = (invoiceAmount / 100000000).toFixed(8).toString();
                // console.log(`setting fee, rate ${fee}, ${rate}, ${this.state.stxAmount}, ${invoiceAmount}, ${invoiceAmountBTC}`);
                
                // convert rate, populate UI
                this.setState({rate, fee, invoiceAmount, invoiceAmountBTC});
                
                switch (this.state.swapType) {
                    case 'reversesubmarine':
                        // create preimage and then swap and show LN invoice
                        this.createSwap();
                        break;

                    // case 'mintnft':
                    //     this.createDirectSwap();
                    //     break;

                    case 'triggerswap':
                    case 'triggertransferswap':
                    case 'sdcreategame':
                    case 'sdjoingame':
                    case 'stacking':
                        this.createTriggerSwap();
                        break;

                    default:
                        console.log('unknown swapType ', this.state.swapType);
                        break;
                }
            })
            .catch(e => {
                console.log(`getpairs error `, e);
                this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to reach LNSwap. Please try again later.', statusColor: 'error', showQr: false});
                // return e;
                
                // send status to host website
                window.top.postMessage({target: 'lnswap', data: {txId: this.state.txId || '', swapId: this.state.swapId || '', status: 'Unable to reach LNSwap'}}, '*')
            });     
    }
    createSwap = () => {
        // moving this here because it seems to cause issues on stxnft?
        // const appConfig = new AppConfig(['store_write', 'publish_data']);
        // let userSession = new UserSession({ appConfig });
        // userSession.signUserOut();

        this.resetState();
        this.createSecret();
        var reqbody = {
            "type": "reversesubmarine",
            "pairId": pairId,
            "orderSide": "sell",
            "claimAddress": this.state.claimAddress,
            // "invoiceAmount": this.state.invoiceAmount,
            "onchainAmount": this.state.stxAmountLarge,
            "preimageHash": this.state.preimageHash
        }
        console.log(`creating swap with: `, reqbody);
        fetch(`${apiUrl}/zcreateswap`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqbody)
            }).then(res => res.json())
            .then(res => {
                // console.log("swap created: ", res);
                if(res.error) {
                    this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. Please try again later.', statusColor: 'error', showQr: false});
                    return;
                }
                var decoded = lightningPayReq.decode(res.invoice);
                const invoiceAmountBTC = (decoded.millisatoshis / 10**11).toFixed(8).toString();
                this.setState({swapId: res.id, invoice: res.invoice.toUpperCase(), paymentLink: `lightning:${res.invoice}`, swapObj: res, invoiceAmountBTC, showQr: true});
                this.listenswap();
            }).catch(e => {
                console.log(`createswap error: `, e);
                this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. Please try again later.', statusColor: 'error', showQr: false});
            });  
    }
    createTriggerSwap = () => {
        // moving this here because it seems to cause issues on stxnft?
        // const appConfig = new AppConfig(['store_write', 'publish_data']);
        // let userSession = new UserSession({ appConfig });
        // userSession.signUserOut();

        this.resetState();
        this.createSecret();
        var reqbody = {
            "type": "reversesubmarine",
            "pairId": pairId,
            "orderSide": "sell",
            "claimAddress": this.state.claimAddress,
            // "invoiceAmount": this.state.invoiceAmount,
            // need to send onchainAmount to ensure right right STX amount!
            "onchainAmount": this.state.stxAmountLarge,
            "preimageHash": this.state.preimageHash,
            "swapType": "triggerStx",
            "prepayMinerFee": this.state.sponsoredTx,
        }
        console.log(`creating triggerswap with: `, reqbody);
        fetch(`${apiUrl}/zcreateswap`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqbody)
            }).then(res => res.json())
            .then(res => {
                // console.log("swap created: ", res);
                if(res.error) {
                    this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. Please try again later.', statusColor: 'error', showQr: false});
                    return;
                }
                var decoded = lightningPayReq.decode(res.invoice);
                const invoiceAmountBTC = (decoded.millisatoshis / 10**11).toFixed(8).toString();
                let minerFeeInvoice = '';
                let showStatus = false;
                if(res.minerFeeInvoice) {
                    minerFeeInvoice = res.minerFeeInvoice.toUpperCase();
                    showStatus = true;
                }
                this.setState({swapId: res.id, invoice: res.invoice.toUpperCase(), paymentLink: `lightning:${res.invoice}`, minerFeeInvoice, minerPaymentLink: `lightning:${minerFeeInvoice}`, swapObj: res, invoiceAmountBTC, showQr: true, swapStatus: 'This invoice is for the transaction fee' , showStatus, });
                this.listenswap();
                // triggerAllowContractCaller for stacking - so it confirms before claim call
                if (this.state.swapType === 'stacking') {
                    this.triggerAllowContractCaller();
                }
            }).catch(e => {
                console.log(`createtriggerswap error: `, e);
                this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. Please try again later.', statusColor: 'error', showQr: false});
            });  
    }
    // createDirectSwap = () => {
    //     this.resetState();
    //     var reqbody = {
    //         "nftAddress": this.state.contractAddress,
    //         "userAddress": this.state.claimAddress,
    //         "contractSignature": this.state.contractSignature,
    //         "stxAmount": this.state.stxAmount,
    //     }
    //     console.log(`creating directSwap with: `, reqbody);
    //     fetch(`${apiUrl}/mintnft`, {
    //         method: 'post',
    //         headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(reqbody)
    //         }).then(res => res.json())
    //         .then(res => {
    //             console.log("directSwap created: ", res);
    //             if(res.error) {
    //                 this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. '+res.error, statusColor: 'error', showQr: false});
    //                 return;
    //             }
    //             // {
    //             //     "id": "KQpyZd",
    //             //     "invoice": "lnbcrt282720n1psa2kpepp5c9zkx7zshn2tlvw3udl6fjzpeh6mxmrkyg8wduky5ul8jk42729qdqqcqzpgsp5jpn35ew7r99e6e38ak3d2yysq0554cc853g4hv4jnlaad6mhrsvs9qyyssqpa5w4qapwas9lchzxcrutza6jwgn22mw8uj0x9sy2r7hgc9xc7prx6pyv5drejg5smcs9gvjvgesnphszymlyexnwzlns3lpkujjg4spnqgggg"
    //             // }
    //             var decoded = lightningPayReq.decode(res.invoice);
    //             // console.log('decoded ', decoded);
    //             const invoiceAmountBTC = (decoded.millisatoshis / 10**11).toFixed(8).toString()
    //             this.setState({swapId: res.id, invoice: res.invoice.toUpperCase(), paymentLink: `lightning:${res.invoice}`, swapObj: res, invoiceAmountBTC, showQr: true});
    //             this.listenswap();
    //         }).catch(e => {
    //             console.log(`createswap error: `, e);
    //             this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. Please try again later.', statusColor: 'error', showQr: false});
    //         });  
    // }
    listenswap = () => {
        var thisthing = this;
        // console.log("listenswap state: ", this.state);
        var stream = new EventSource(apiUrl + '/streamswapstatus?id=' + this.state.swapId);

        stream.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log('Swap status update: ', data);
            switch (data.status) {
                case "transaction.failed":
                    let errorText = 'Swap failed. Please try again later.'
                    if(data.transaction && data.transaction.id) {
                        errorText = 'Swap failed. ' + data.transaction.id.substring(50)
                    }
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: errorText, statusColor: 'error', showQr: false});
                    stream.close();
                    break;

                case "transaction.mempool":
                    console.log('tx.mempool ', thisthing.state, )
                    if((thisthing.state.swapType === 'triggerswap') && !thisthing.state.presigned && thisthing.state.sponsoredTx) {
                        // nft purchase with pre-signed tx
                        thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Pre-sign the NFT claim transaction.', statusColor: 'info', showButton: true, showQr: false, buttonText: 'Confirm'});
                        break;
                    }
                    thisthing.setState({showLoading: true, showStatus: true, swapStatus: 'LNSwap.org is locking funds into the swap contract.', txId: data.transaction.id, statusColor: 'warn', showButton: false, showQr: false});
                    break;
                    
                case "transaction.confirmed":
                    let statusText = 'Funds are locked. Ready to claim.';
                    if(thisthing.state.swapType === 'triggerswap' && thisthing.state.presigned) {
                        statusText = 'Funds are locked. Claiming NFT.'
                    }
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: statusText, txId: data.transaction.id, statusColor: 'success', showButton: true, showQr: false});
                    break;

                case "transaction.claimed":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Claim successful 🚀', statusColor: 'success', showButton: false, showComplete: true,});
                    window.top.postMessage({target: 'lnswap', data: {txId: this.state.txId, swapId: this.state.swapId, status: 'Claim successful'}}, '*')
                    break;

                case "invoice.settled":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Claim successful 🚀', statusColor: 'success', showButton: false, showComplete: true,});
                    window.top.postMessage({target: 'lnswap', data: {txId: this.state.txId || '', swapId: this.state.swapId || '', status: 'Claim successful'}}, '*')
                    break;

                case "nft.minted":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'NFT minting started 🚀', txId: data.transaction.id, statusColor: 'success', showButton: false, showQr: false, showComplete: true,});
                    window.top.postMessage({target: 'lnswap', data: {txId: data.transaction.id, swapId: this.state.swapId, status: 'NFT minting started'}}, '*')
                    break;

                case "minerfee.paid":
                    thisthing.setState({minerFeePaid: true, showQr: true, swapStatus: 'This invoice is the swap hold invoice' , showStatus: true,});
                    break;
                    
                default:
                    break;
            }
            // data: {"status":"transaction.mempool"}
            // data: {"status":"invoice.paid"}
        };
    }

    claimStx = async() => {  
        let thisthing = this;

        this.setState({buttonLoading: true,});
        console.log("swapObj: ", this.state.swapObj);
        let contractAddress = this.state.swapObj.lockupAddress.split(".")[0].toUpperCase();
        let contractName = this.state.swapObj.lockupAddress.split(".")[1]
        // console.log("claimStx ", contractAddress, contractName)
      
        let preimage = this.state.preimage;
        // let amount = this.state.swapObj.onchainAmount;
        let amount = this.state.stxAmountLarge;
        let timeLock = this.state.swapObj.timeoutBlockHeight;
      
        console.log(`Claiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock}`);
      
        // console.log("amount, decimalamount: ", amount)
        let smallamount = parseInt(amount / 100)
        //  + 1 -> never do this
        // console.log("smallamount: " + smallamount)
      
        let swapamount = smallamount.toString(16).split(".")[0] + "";
        let postConditionAmount = Math.ceil(parseInt(smallamount));

        const postConditionAddress = contractAddress;
        const postConditionCode = FungibleConditionCode.LessEqual;
        const postConditions = [
          makeContractSTXPostCondition(
            postConditionAddress,
            contractName,
            postConditionCode,
            postConditionAmount
          )
        ];
      
        // console.log("postConditions: " + contractAddress, contractName, postConditionCode, postConditionAmount)
      
      
        let paddedamount = swapamount.padStart(32, "0");
        let paddedtimelock = timeLock.toString(16).padStart(32, "0");
        // console.log("amount, timelock ", smallamount, swapamount, paddedamount, paddedtimelock, activeNetwork);
      
        // (claimStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)))
        const functionArgs = [
          bufferCV(Buffer.from(preimage,'hex')),
          uintCV(smallamount)
        //   bufferCV(Buffer.from(paddedamount,'hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from(paddedtimelock,'hex')),
        ];
        const txOptions = {
          contractAddress: contractAddress,
          contractName: contractName,
          functionName: 'claimStx',
          functionArgs: functionArgs,
          // validateWithAbi: true,
          network: activeNetwork,
        //   postConditionMode: PostConditionMode.Allow,
          postConditions,
          // anchorMode: AnchorMode.Any,
          onFinish: data => {
            console.log('Stacks claim onFinish:', data);
            this.setState({txId: data.txId});
            window.top.postMessage({target: 'lnswap', data: {txId: data.txId, swapId: this.state.swapId, status: 'claimStx pending'}}, '*')
          },
          onCancel: data => {
            console.log('Stacks claim onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }

    triggerStx = async() => {  
        let thisthing = this;

        this.setState({buttonLoading: true,});
        console.log("triggerStx swapObj: ", this.state.swapObj);
        let contractAddress = this.state.swapObj.lockupAddress.split(".")[0].toUpperCase();
        let contractName = this.state.swapObj.lockupAddress.split(".")[1]
        // console.log("claimStx ", contractAddress, contractName)

        const nftAddress = this.state.contractAddress.split(".")[0].toUpperCase();
        const nftName = this.state.contractAddress.split(".")[1];
      
        let preimage = this.state.preimage;
        // let amount = this.state.swapObj.onchainAmount;
        let amount = this.state.stxAmountLarge;
        let timeLock = this.state.swapObj.timeoutBlockHeight;
      
        console.log(`TriggerClaiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock} for nft ${nftAddress} ${nftName} and send to ${this.state.claimAddress}`);
      
        // console.log("amount, decimalamount: ", amount)
        let smallamount = parseInt(amount / 100)
        //  + 1 -> never do this
        // console.log("smallamount: " + smallamount)
      
        let swapamount = smallamount.toString(16).split(".")[0] + "";

        // post conditions disabled - couldnt make it work for some reason
        let postConditionAmount = Math.ceil(parseInt(smallamount));
        const postConditionAddress = contractAddress;
        const postConditionCode = FungibleConditionCode.LessEqual;

        // // With a contract principal
        // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
        // const contractName = 'test-contract';

        // // With a standard principal
        // // const postConditionAddress = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';
        // const nftPostConditionCode = NonFungibleConditionCode.Owns;
        // // const assetAddress = 'SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ';
        // // const assetContractName = 'test-asset-contract';
        // const assetName = 'cube';
        // const tokenAssetName = stringAsciiCV('cube');
        // const nonFungibleAssetInfo = createAssetInfo(nftAddress, nftName, assetName);

        // const standardNonFungiblePostCondition = makeStandardNonFungiblePostCondition(
        //     this.state.claimAddress,
        //     nftPostConditionCode,
        //     nonFungibleAssetInfo,
        //     tokenAssetName
        // );

        const standardStxPostCondition = makeStandardSTXPostCondition(
            this.state.claimAddress,
            FungibleConditionCode.LessEqual,
            postConditionAmount
        );

        const postConditions = [
          makeContractSTXPostCondition(
            postConditionAddress,
            contractName,
            postConditionCode,
            postConditionAmount
          ),
            // standardNonFungiblePostCondition
            standardStxPostCondition
        ];
      
        // console.log("postConditions: " + contractAddress, contractName, postConditionCode, postConditionAmount)
      
      
        let paddedamount = swapamount.padStart(32, "0");
        let paddedtimelock = timeLock.toString(16).padStart(32, "0");
        // console.log("amount, timelock, activeNetwork ", smallamount, swapamount, paddedamount, paddedtimelock, activeNetwork);
      
        // (triggerStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)) (nftPrincipal <claim-for-trait>) (userPrincipal principal)
        const functionArgs = [
          bufferCV(Buffer.from(preimage,'hex')),
          uintCV(smallamount),
        //   bufferCV(Buffer.from(paddedamount,'hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from(paddedtimelock,'hex')),
          contractPrincipalCV(nftAddress, nftName),
        //   standardPrincipalCV(this.state.claimAddress), // removed on triggerswap-v2
        ];
        const txOptions = {
          contractAddress: contractAddress,
          contractName: this.state.triggerContractName,
          functionName: 'triggerStx',
          functionArgs: functionArgs,
          // validateWithAbi: true,
          network: activeNetwork,
          postConditionMode: PostConditionMode.Deny,
          postConditions,
          sponsored: this.state.sponsoredTx,
          // anchorMode: AnchorMode.Any,
          onFinish: data => {
            console.log('Stacks claim onFinish:', data);
            if(!this.state.sponsoredTx) {
                this.setState({txId: data.txId});
                window.top.postMessage({target: 'lnswap', data: {txId: data.txId, swapId: this.state.swapId, status: 'triggerStx pending'}}, '*')
            } else {
                // sponsored tx - send signed tx to backend to broadcast
                const serializedTx = data.stacksTransaction.serialize().toString('hex');
                this.broadcastSponsoredTx(serializedTx);
            }
          },
          onCancel: data => {
            console.log('Stacks claim onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }
    triggerTransferStx = async() => {  
        let thisthing = this;

        this.setState({buttonLoading: true,});
        console.log("triggerTransferStx swapObj: ", this.state.swapObj);
        let contractAddress = this.state.swapObj.lockupAddress.split(".")[0].toUpperCase();
        let contractName = this.state.swapObj.lockupAddress.split(".")[1]
        // console.log("claimStx ", contractAddress, contractName)

        const nftAddress = this.state.contractAddress.split(".")[0].toUpperCase();
        const nftName = this.state.contractAddress.split(".")[1];
      
        let preimage = this.state.preimage;
        // let amount = this.state.swapObj.onchainAmount;
        let amount = this.state.stxAmountLarge;
        let timeLock = this.state.swapObj.timeoutBlockHeight;
      
        console.log(`triggerTransferStx claiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock} and send to ${this.state.receiverAddress} on ${JSON.stringify(activeNetwork)}`);
      
        // console.log("amount, decimalamount: ", amount)
        let smallamount = parseInt(amount / 100)
        //  + 1 -> never do this
        // console.log("smallamount: " + smallamount)
      
        let swapamount = smallamount.toString(16).split(".")[0] + "";

        // post conditions disabled - couldnt make it work for some reason
        let postConditionAmount = Math.ceil(parseInt(smallamount));
        const postConditionAddress = contractAddress;
        const postConditionCode = FungibleConditionCode.LessEqual;

        // // With a contract principal
        // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
        // const contractName = 'test-contract';

        // // With a standard principal
        // // const postConditionAddress = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';
        // const nftPostConditionCode = NonFungibleConditionCode.Owns;
        // // const assetAddress = 'SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ';
        // // const assetContractName = 'test-asset-contract';
        // const assetName = 'cube';
        // const tokenAssetName = stringAsciiCV('cube');
        // const nonFungibleAssetInfo = createAssetInfo(nftAddress, nftName, assetName);

        // const standardNonFungiblePostCondition = makeStandardNonFungiblePostCondition(
        //     this.state.claimAddress,
        //     nftPostConditionCode,
        //     nonFungibleAssetInfo,
        //     tokenAssetName
        // );

        const standardStxPostCondition = makeStandardSTXPostCondition(
            this.state.claimAddress,
            FungibleConditionCode.LessEqual,
            postConditionAmount
        );

        const postConditions = [
          makeContractSTXPostCondition(
            postConditionAddress,
            contractName,
            postConditionCode,
            postConditionAmount
          ),
            // standardNonFungiblePostCondition
            standardStxPostCondition
        ];
      
        // console.log("postConditions: " + contractAddress, contractName, postConditionCode, postConditionAmount)
      
      
        let paddedamount = swapamount.padStart(32, "0");
        let paddedtimelock = timeLock.toString(16).padStart(32, "0");
        // console.log("amount, timelock, activeNetwork ", smallamount, swapamount, paddedamount, paddedtimelock, activeNetwork);
      
        // (triggerStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)) (nftPrincipal <claim-for-trait>) (userPrincipal principal)
        const functionArgs = [
          bufferCV(Buffer.from(preimage,'hex')),
          uintCV(smallamount),
        //   bufferCV(Buffer.from(paddedamount,'hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from(paddedtimelock,'hex')),
        //   contractPrincipalCV(nftAddress, nftName),
          standardPrincipalCV(this.state.receiverAddress),
          stringAsciiCV(this.state.stxMemo),
        ];
        const txOptions = {
          contractAddress: contractAddress,
          contractName: this.state.triggerContractName,
          functionName: 'triggerTransferStx',
          functionArgs: functionArgs,
          // validateWithAbi: true,
          network: activeNetwork,
        //   postConditionMode: PostConditionMode.Allow,
          postConditionMode: PostConditionMode.Deny,
          postConditions,
          sponsored: this.state.sponsoredTx,
          // anchorMode: AnchorMode.Any,
          onFinish: data => {
            console.log('Stacks claim onFinish:', data);
            if(!this.state.sponsoredTx) {
                this.setState({txId: data.txId});
                window.top.postMessage({target: 'lnswap', data: {txId: data.txId, swapId: this.state.swapId, status: 'triggerTransferStx pending'}}, '*')
            } else {
                // sponsored tx - send signed tx to backend to broadcast
                const serializedTx = data.stacksTransaction.serialize().toString('hex');
                this.broadcastSponsoredTx(serializedTx);
            }
          },
          onCancel: data => {
            console.log('Stacks claim onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }
    triggerTrustlessRewards = async() => {  
        let thisthing = this;

        this.setState({buttonLoading: true,});
        console.log("triggerTrustlessRewards state: ", this.state);
        let contractAddress = this.state.swapObj.lockupAddress.split(".")[0].toUpperCase();
        let contractName = this.state.swapObj.lockupAddress.split(".")[1]
        // console.log("claimStx ", contractAddress, contractName)

        const nftAddress = this.state.contractAddress.split(".")[0].toUpperCase();
        const nftName = this.state.contractAddress.split(".")[1];
      
        let preimage = this.state.preimage;
        // let amount = this.state.swapObj.onchainAmount;
        let amount = this.state.stxAmountLarge;
        let timeLock = this.state.swapObj.timeoutBlockHeight;
      
        console.log(`triggerTrustlessRewards ${amount} Stx with preimage ${preimage} and timelock ${timeLock} for nft ${nftAddress} ${nftName} and call to ${this.state.contractAddress}`);
      
        // console.log("amount, decimalamount: ", amount)
        let smallamount = parseInt(amount / 100)
        //  + 1 -> never do this
        // console.log("smallamount: " + smallamount)
      
        let swapamount = smallamount.toString(16).split(".")[0] + "";

        // post conditions disabled - couldnt make it work for some reason
        let postConditionAmount = Math.ceil(parseInt(smallamount));
        const postConditionAddress = contractAddress;
        const postConditionCode = FungibleConditionCode.LessEqual;

        // // With a contract principal
        // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
        // const contractName = 'test-contract';

        // // With a standard principal
        // // const postConditionAddress = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';
        // const nftPostConditionCode = NonFungibleConditionCode.Owns;
        // // const assetAddress = 'SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ';
        // // const assetContractName = 'test-asset-contract';
        // const assetName = 'cube';
        // const tokenAssetName = stringAsciiCV('cube');
        // const nonFungibleAssetInfo = createAssetInfo(nftAddress, nftName, assetName);

        // const standardNonFungiblePostCondition = makeStandardNonFungiblePostCondition(
        //     this.state.claimAddress,
        //     nftPostConditionCode,
        //     nonFungibleAssetInfo,
        //     tokenAssetName
        // );

        const standardStxPostCondition = makeStandardSTXPostCondition(
            this.state.claimAddress,
            FungibleConditionCode.LessEqual,
            postConditionAmount
        );

        const postConditions = [
          makeContractSTXPostCondition(
            postConditionAddress,
            contractName,
            postConditionCode,
            postConditionAmount
          ),
            // standardNonFungiblePostCondition
            standardStxPostCondition
        ];
      
        // console.log("postConditions: " + contractAddress, contractName, postConditionCode, postConditionAmount)
      
        // let paddedamount = swapamount.padStart(32, "0");
        // let paddedtimelock = timeLock.toString(16).padStart(32, "0");
        // console.log("amount, timelock, activeNetwork ", smallamount, swapamount, paddedamount, paddedtimelock, activeNetwork);
      
        let functionName = ''
        let functionArgs;
        if(this.state.swapType === 'sdcreategame') {
            functionName = 'triggerCreateLobby';
            // (triggerCreateLobby (preimage (buff 32)) (amount uint) (description (string-ascii 99)) (price uint) (factor uint) (commission uint) 
            //   (mapy (string-ascii 30)) (length (string-ascii 10)) (traffic (string-ascii 10)) (curves (string-ascii 10)) (hours uint) (contractPrincipal <trustless-rewards-trait>)
            functionArgs = [
                bufferCV(Buffer.from(preimage,'hex')),
                uintCV(smallamount),
                stringAsciiCV(this.state.callParameters[0]),
                uintCV(this.state.callParameters[1]),
                uintCV(this.state.callParameters[2]),
                uintCV(this.state.callParameters[3]),
                stringAsciiCV(this.state.callParameters[4]),
                stringAsciiCV(this.state.callParameters[5]),
                stringAsciiCV(this.state.callParameters[6]),
                stringAsciiCV(this.state.callParameters[7]),
                uintCV(this.state.callParameters[8]),
                contractPrincipalCV(nftAddress, nftName),
            ];
        } else {
            functionName = 'triggerJoinLobby';
            // (triggerJoinLobby (preimage (buff 32)) (amount uint) (id uint) (contractPrincipal <trustless-rewards-trait>))
            functionArgs = [
                bufferCV(Buffer.from(preimage,'hex')),
                uintCV(smallamount),
                uintCV(this.state.callParameters[0]),
                contractPrincipalCV(nftAddress, nftName),
            ];
        }

        const txOptions = {
          contractAddress: contractAddress,
          contractName: this.state.triggerContractName,
          functionName,
          functionArgs,
          // validateWithAbi: true,
          network: activeNetwork,
          postConditionMode: PostConditionMode.Deny,
          postConditions,
          sponsored: this.state.sponsoredTx,
          // anchorMode: AnchorMode.Any,
          onFinish: data => {
            console.log('Stacks claim onFinish:', data);
            if(!this.state.sponsoredTx) {
                this.setState({txId: data.txId});
                window.top.postMessage({target: 'lnswap', data: {txId: data.txId, swapId: this.state.swapId, status: functionName + ' pending'}}, '*')
            } else {
                // sponsored tx - send signed tx to backend to broadcast
                const serializedTx = data.stacksTransaction.serialize().toString('hex');
                this.broadcastSponsoredTx(serializedTx);
            }
          },
          onCancel: data => {
            console.log('Stacks claim onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }
    triggerAllowContractCaller = async() => {  
        let thisthing = this;
        let contractAddress = this.state.swapObj.lockupAddress.split(".")[0].toUpperCase();

        console.log("triggerAllowContractCaller swapObj: ", this.state.swapObj);     
        console.log(`triggerAllowContractCaller for ${this.state.claimAddress} to ${contractAddress}.${this.state.triggerContractName} on ${JSON.stringify(activeNetwork)} `);

        // allow-contract-caller (caller principal) (until-burn-ht (optional uint)
        const functionArgs = [
          contractPrincipalCV(contractAddress, this.state.triggerContractName),
          noneCV()
        ];
        const txOptions = {
          contractAddress: this.isTestnet() ? 'ST000000000000000000002AMW42H' : 'SP000000000000000000002Q6VF78',
          contractName: 'pox',
          functionName: 'allow-contract-caller',
          functionArgs: functionArgs,
          // validateWithAbi: true,
          network: activeNetwork,
        //   postConditionMode: PostConditionMode.Allow,
          postConditionMode: PostConditionMode.Deny,
        //   postConditions,
          sponsored: this.state.sponsoredTx,
          // anchorMode: AnchorMode.Any,
          onFinish: data => {
            console.log('Stacks triggerAllowContractCaller onFinish:', data);
            window.top.postMessage({target: 'lnswap', data: {txId: data.txId, swapId: this.state.swapId, status: 'triggerAllowContractCaller pending'}}, '*')
            // if(!this.state.sponsoredTx) {
            //     this.setState({txId: data.txId});
            // } else {
            //     // sponsored tx - send signed tx to backend to broadcast
            //     const serializedTx = data.stacksTransaction.serialize().toString('hex');
            //     this.broadcastSponsoredTx(serializedTx);
            // }
          },
          onCancel: data => {
            console.log('Stacks triggerAllowContractCaller onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }
    triggerStacking = async() => {  
        let thisthing = this;

        this.setState({buttonLoading: true,});
        console.log("triggerStacking swapObj: ", this.state.swapObj);
        let contractAddress = this.state.swapObj.lockupAddress.split(".")[0].toUpperCase();
        let contractName = this.state.swapObj.lockupAddress.split(".")[1]
        // console.log("claimStx ", contractAddress, contractName)

        // SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60 -> friedger 1-cycle 
        const delegateAddress = this.state.contractAddress.toUpperCase() || 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60';
        // const nftName = this.state.contractAddress.split(".")[1];
      
        let preimage = this.state.preimage;
        // let amount = this.state.swapObj.onchainAmount;
        let amount = this.state.stxAmountLarge;
        let timeLock = this.state.swapObj.timeoutBlockHeight;
      
        console.log(`triggerStacking claiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock} and delegate to ${delegateAddress} stack for ${this.state.claimAddress} on ${JSON.stringify(activeNetwork)}`);
      
        // console.log("amount, decimalamount: ", amount)
        let smallamount = parseInt(amount / 100)
        //  + 1 -> never do this
        // console.log("smallamount: " + smallamount)
      
        let swapamount = smallamount.toString(16).split(".")[0] + "";

        // post conditions disabled - couldnt make it work for some reason
        let postConditionAmount = Math.ceil(parseInt(smallamount));
        const postConditionAddress = contractAddress;
        const postConditionCode = FungibleConditionCode.LessEqual;

        // // With a contract principal
        // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
        // const contractName = 'test-contract';

        // // With a standard principal
        // // const postConditionAddress = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';
        // const nftPostConditionCode = NonFungibleConditionCode.Owns;
        // // const assetAddress = 'SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ';
        // // const assetContractName = 'test-asset-contract';
        // const assetName = 'cube';
        // const tokenAssetName = stringAsciiCV('cube');
        // const nonFungibleAssetInfo = createAssetInfo(nftAddress, nftName, assetName);

        // const standardNonFungiblePostCondition = makeStandardNonFungiblePostCondition(
        //     this.state.claimAddress,
        //     nftPostConditionCode,
        //     nonFungibleAssetInfo,
        //     tokenAssetName
        // );

        // const standardStxPostCondition = makeStandardSTXPostCondition(
        //     this.state.claimAddress,
        //     FungibleConditionCode.LessEqual,
        //     postConditionAmount
        // );

        const postConditions = [
          makeContractSTXPostCondition(
            postConditionAddress,
            contractName,
            postConditionCode,
            postConditionAmount
          ),
            // standardNonFungiblePostCondition
            // standardStxPostCondition
        ];
      
        // console.log("postConditions: " + contractAddress, contractName, postConditionCode, postConditionAmount)
      
      
        // let paddedamount = swapamount.padStart(32, "0");
        // let paddedtimelock = timeLock.toString(16).padStart(32, "0");
        // console.log("amount, timelock, activeNetwork ", smallamount, swapamount, paddedamount, paddedtimelock, activeNetwork);
      
        // (triggerStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)) (nftPrincipal <claim-for-trait>) (userPrincipal principal)
        const functionArgs = [
          bufferCV(Buffer.from(preimage,'hex')),
          uintCV(smallamount),
        //   bufferCV(Buffer.from(paddedamount,'hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from('01','hex')),
        //   bufferCV(Buffer.from(paddedtimelock,'hex')),
        //   contractPrincipalCV(nftAddress, nftName),
          standardPrincipalCV(delegateAddress),
          noneCV()
        ];
        const txOptions = {
          contractAddress: contractAddress,
          contractName: this.state.triggerContractName,
          functionName: 'triggerStacking',
          functionArgs: functionArgs,
          // validateWithAbi: true,
          network: activeNetwork,
        //   postConditionMode: PostConditionMode.Allow,
          postConditionMode: PostConditionMode.Deny,
          postConditions,
          sponsored: this.state.sponsoredTx,
          // anchorMode: AnchorMode.Any,
          onFinish: data => {
            console.log('Stacks triggerStacking onFinish:', data);
            if(!this.state.sponsoredTx) {
                this.setState({txId: data.txId});
                window.top.postMessage({target: 'lnswap', data: {txId: data.txId, swapId: this.state.swapId, status: 'triggerStacking pending'}}, '*')
            } else {
                // sponsored tx - send signed tx to backend to broadcast
                const serializedTx = data.stacksTransaction.serialize().toString('hex');
                this.broadcastSponsoredTx(serializedTx);
            }
          },
          onCancel: data => {
            console.log('Stacks triggerStacking onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }
    broadcastSponsoredTx = (rawTx) => {
        var reqbody = {
            "id": this.state.swapId,
            "tx": rawTx,
        }
        console.log(`creating broadcastsponsoredtx with: `, reqbody);
        fetch(`${apiUrl}/zbroadcastsponsoredtx`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqbody)
            }).then(res => res.json())
            .then(res => {
                console.log("broadcastsponsoredtx response: ", res);
                if(res.error) {
                    this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to broadcast transaction. '+res.error, statusColor: 'error', showQr: false, showButton: false,});
                    return;
                }
                if(JSON.stringify(res).includes('error')) {
                    this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to broadcast transaction. ', statusColor: 'error', showQr: false, showButton: false,});
                    return;
                }
                if(res.transactionId && res.transactionId.transactionId && res.transactionId.transactionId === 'txsaved') {
                    this.setState({showStatus: true, swapStatus: 'Tx saved. You will receive your NFT in your wallet soon.', statusColor: 'warn', showQr: false, presigned: true,});
                }
                if(res.transactionId && res.transactionId.transactionId && res.transactionId.transactionId !== 'txsaved') {
                    this.setState({txId: res.transactionId.transactionId, });
                }
                // this.setState({swapId: res.id, invoice: res.invoice.toUpperCase(), paymentLink: `lightning:${res.invoice}`, swapObj: res, invoiceAmountBTC, showQr: true});
                // this.listenswap();
            }).catch(e => {
                console.log(`broadcastSponsoredTx error: `, e);
                this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to broadcast transaction. Please try again later.', statusColor: 'error', showQr: false, showButton: false,});
            });  
    }
    isTestnet() {
        return (Config.apiUrl.includes("testnet") || Config.mocknetUrl.includes("gitpod"))
    }
};

export default Widget;