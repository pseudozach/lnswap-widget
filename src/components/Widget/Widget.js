import React from 'react'
import ReactDOM from 'react-dom';
// import Modal from 'react-modal';
import Config from '../../config';
import './Widget.css';
// import sha256 from 'crypto-js/sha256';
import { crypto } from 'bitcoinjs-lib';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
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

import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import {
  bufferCV,
  // makeStandardSTXPostCondition,
  FungibleConditionCode,
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
} from '@stacks/transactions';

const appConfig = new AppConfig(['store_write', 'publish_data']);

// uncomment when signout testing is needed.
// let userSession = new UserSession({ appConfig });
// userSession.signUserOut();

import bigInt from 'big-integer';
import { BN } from 'bn.js';

let mocknet = new StacksMocknet({url: Config.mocknetUrl});
// mocknet.coreApiUrl = 'http://localhost:3999';
// mocknet.coreApiUrl = 'https://3999-azure-cricket-glgzsgrt.ws-us17.gitpod.io'
const testnet = new StacksTestnet();
const mainnet = new StacksMainnet();
let activeNetwork = mocknet

// let stacksNetworkType = "mocknet";
if(Config.apiUrl.includes("lnswap")){
  activeNetwork = mainnet
} else if(Config.apiUrl.includes("gitpod")){
  activeNetwork = mocknet
} else {
  activeNetwork = testnet
}

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
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    width: 'fit-content',
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
            stxAmount: '10',
            invoiceAmount: 0,
            invoiceAmountBTC: '...',
            preimage: '',
            preimageHash: '',
            rate: '30000',
            fee: '5',
            paymentLink: 'invoice',
            showLoading: true,
            showButton: false,
            swapId: '',
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
        };
    }

    render() {
        if (this.state.modalIsOpen) {
            return (
                // <div className="widget-container">
                //     <h1>I'm a {widgetName}</h1>
                //     <div>I have a message: {this.state.message}</div>
                // </div>

                // <Modal
                //     isOpen={this.state.modalIsOpen}
                //     // onAfterOpen={afterOpenModal}
                //     onRequestClose={this.closeModal}
                //     style={customStyles}
                //     ariaHideApp={false}
                //     contentLabel="Example Modal"
                // >
                //     {/* ref={(_subtitle) => (subtitle = _subtitle)} */}
                //     <h2>Hello</h2>
                //     <button onClick={this.closeModal}>close</button>
                //     <div>I am a modal</div>
                //     <form>
                //         <input />
                //         <button>tab navigation</button>
                //         <button>stays</button>
                //         <button>inside</button>
                //         <button>the modal</button>
                //     </form>
                // </Modal>
                
                <Modal
                open={this.state.modalIsOpen}
                onClose={this.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={scrollModalStyle}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        Send BTC, Receive STX
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        Confirm details and pay the LN invoice to start the swap.
                        </Typography>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' }, display: 'inline-flex',
                            }}
                            noValidate
                            autoComplete="off"
                            >
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', }}
                            id="outlined-required"
                            label={pairId + " Rate"}
                            value={this.state.rate}
                            />
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', }}
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
                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                            >
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', }}
                            id="outlined-required"
                            label="Send"
                            value={this.state.invoiceAmountBTC}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                                }}
                            />
                            {/* <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', }}
                            id="outlined-required"
                            label="Amount To Pay"
                            value={this.state.invoiceAmount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">sats</InputAdornment>,
                                }}
                            /> */}
                            <TextField
                            disabled
                            sx={{ m: 1, width: '25ch', }}
                            id="outlined-required"
                            label="Receive"
                            value={this.state.stxAmount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">STX</InputAdornment>,
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                mx: 'auto',
                                // bgcolor: 'primary.main',
                                // color: '#fff',
                                // width: 200,
                                // p: 1,
                                // m: 1,
                                // borderRadius: 1,
                                textAlign: 'center',
                            }}
                            >
                            {this.state.showQr ? (
                                <>
                                <a href={this.state.paymentLink}>
                                <QRCode 
                                    value={this.state.invoice} 
                                /></a>
                                <Box sx={{ my: '1em', cursor: 'pointer'}} fullWidth>
                                    <Tooltip open={this.state.showCopyTooltip} title="Copied">
                                        <TextField 
                                            disabled 
                                            fullWidth
                                            size="small"
                                            variant="outlined" 
                                            value={this.state.invoice} 
                                            maxRows={1} 
                                            onClick={this.copyToClipboard}
                                            sx={{ cursor: 'pointer'}}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end"><ContentCopyIcon /></InputAdornment>,
                                                style: { cursor: 'pointer' }
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                                </>
                            ) : null}
                            {this.state.swapStatus.includes("lock") ? (<LockIcon color="theme.palette.success.dark" fontSize="large" sx={{ fontSize: '5em'}} />) : null}
                            {this.state.swapStatus.includes("fail") ? (<CancelIcon color="theme.palette.error.dark" fontSize="large" sx={{ fontSize: '5em'}} />) : null}
                            {this.state.showComplete ? (
                                <CheckCircleIcon color="success" fontSize="large" sx={{ fontSize: '5em'}} />
                            ) : null}
                            {this.state.showStatus ? (
                                <Typography variant="body1" gutterBottom component="div" sx={{ mx: 'auto', textAlign: 'center' }} color={this.state.statusColor}>
                                {this.state.swapStatus}
                                </Typography>
                            ) : null}
                        </Box>
                        <Divider sx={{ m: 2 }} />
                        {this.state.showLoading ? (<CircularProgress sx={{ mx: 'auto', textAlign: 'center', display: 'block', margin: 'auto' }} />) : null}
                        {this.state.showButton ? (
                            <Box
                                sx={{mx: 'auto',textAlign: 'center',}}>
                                <LoadingButton
                                    sx={{ mx: 'auto'}}
                                    onClick={this.connectStacksWallet}
                                    endIcon={<SendIcon />}
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
                                '& .MuiTextField-root': { m: 1, width: '25ch', color: 'gray' },
                            }}
                            noValidate
                            autoComplete="off"
                            >
                            <Typography 
                                variant="caption" 
                                display="block" 
                                gutterBottom
                                sx={{ float: 'left' }}
                            >
                                Swap ID: {this.state.swapId}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                display="block" 
                                gutterBottom
                                sx={{ float: 'right' }}
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
        let userSession = new UserSession({ appConfig });
        let thisthing = this;
        // console.log("connectStacksWallet, ", userSession);
        if(userSession.isUserSignedIn()) {
          let userData = userSession.loadUserData();
          console.log(`userData: `, userData);
          this.claimStx();
        } else {
            // console.log(`launching connect`);
            showConnect({
                appDetails: {
                    name: 'LNSwap',
                    icon: 'https://lnswap.org/favicon.ico',
                },
                // redirectTo: '/',
                // finished: () => {
                //     // window.location.reload();
                //     // thisthing.claimStx();
                //     console.log(`connect finished`);
                //     thisthing.setState({buttonText: 'Claim'});
                // },
                userSession: userSession,
            }); 
        }
    }    
    copyToClipboard = () => {
        let thisthing = this;
        navigator.clipboard.writeText(this.state.invoice);
        this.setState({showCopyTooltip: true});
        setTimeout(() => {
            thisthing.setState({showCopyTooltip: false});
        }, 1000);
    }
    handleClick = () => {
        this.setState({buttonLoading: true,});
    }
    handleClose = () => {
        console.log(`closeModal `, this.state);
        this.setState({modalIsOpen: false});
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
        this.createswap();
    }
    setMessage(...message){
        // console.log(`swapParams: `, message)
        this.setState({claimAddress: message[0], stxAmount: message[1], modalIsOpen: true});
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
                
                // create preimage and then swap and show LN invoice
                this.createSecret();
            })
            .catch(e => {
                console.log(`getpairs error `, e);
                this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to reach LNSwap. Please try again later.', statusColor: 'error', showQr: false});
                // return e;
            });     
    }
    createswap = () => {
        var reqbody = {
            "type": "reversesubmarine",
            "pairId": pairId,
            "orderSide": "sell",
            "claimAddress": this.state.claimAddress,
            "invoiceAmount": this.state.invoiceAmount,
            "preimageHash": this.state.preimageHash
        }
        console.log(`creating swap with: `, reqbody);
        fetch(`${apiUrl}/createswap`, {
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
                // id: "U8InKl"
                // invoice: "lnbc2165060n1pskemqapp54l6hpdcs0t4dpreuwzym9wsqha7f7ra4jll4aywzes8l5h5thq8qdql2djkuepqw3hjq565tqsxzerywfjhxuccqzylxqrrsssp57963jvgs274sk6vkcc5eak0huahhk823000ha9np8fa826fnz38s9qyyssqgdzfrcy6yv0jp564g5tq86nwvfxchenxg7lc48jjaxm34aq0x8ejc5qnwmmtmdrml62n8sh8xu62hmhumrwwlewmyk9yu7c9n5ylkxsp84ryjz"
                // lockupAddress: "sp2507vnqzc9vbxm7x7kb4sf4qjdjrswhg4v39wpy.stxswap_v7"
                // onchainAmount: 4950136866
                // refundAddress: "sp13r6d5p5tye71d81gzqwsd9pgqmqqn54a2yt3by"
                // timeoutBlockHeight: 34313
                this.setState({swapId: res.id, invoice: res.invoice.toUpperCase(), paymentLink: `lightning:${res.invoice}`, swapObj: res, showQr: true});
                this.listenswap();
            }).catch(e => {
                console.log(`createswap error: `, e);
                this.setState({showLoading: false, showStatus: true, swapStatus: 'Unable to create swap. Please try again later.', statusColor: 'error', showQr: false});
            });  
    }
    listenswap = () => {
        var thisthing = this;
        // console.log("listenswap state: ", this.state);
        var stream = new EventSource(apiUrl + '/streamswapstatus?id=' + this.state.swapId);

        stream.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log('Swap status update: ' + data.status);
            switch (data.status) {
                case "transaction.failed":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Swap failed. Please try again later.', statusColor: 'error', showQr: false});
                    stream.close();
                    break;

                case "transaction.confirmed":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Funds are locked in the swap contract. Ready to claim.', statusColor: 'success', showButton: true, showQr: false});
                    break;

                case "transaction.claimed":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Claim successful 🚀', statusColor: 'success', showButton: false, showComplete: true,});
                    break;

                case "invoice.settled":
                    thisthing.setState({showLoading: false, showStatus: true, swapStatus: 'Claim successful 🚀', statusColor: 'success', showButton: false, showComplete: true,});
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
        let amount = this.state.swapObj.onchainAmount;
        let timeLock = this.state.swapObj.timeoutBlockHeight;
      
        console.log(`Claiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock}`);
      
        // console.log("amount, decimalamount: ", amount)
        let smallamount = parseInt(amount / 100) + 1
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
        // console.log("amount, timelock ", smallamount, swapamount, paddedamount, paddedtimelock);
      
        // (claimStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)))
        const functionArgs = [
          bufferCV(Buffer.from(preimage,'hex')),
          bufferCV(Buffer.from(paddedamount,'hex')),
          bufferCV(Buffer.from('01','hex')),
          bufferCV(Buffer.from('01','hex')),
          bufferCV(Buffer.from(paddedtimelock,'hex')),
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
          },
          onCancel: data => {
            console.log('Stacks claim onCancel:', data);   
            thisthing.setState({buttonLoading: false});
          }
        };
        await openContractCall(txOptions);
    }

};

export default Widget;