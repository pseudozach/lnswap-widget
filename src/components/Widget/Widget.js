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
    },
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    width: 'fit-content',
  };
  
  const randomBytes = size => {
    const bytes = Buffer.allocUnsafe(size);
    global.crypto.getRandomValues(bytes);
  
    return bytes;
  };

class Widget extends React.Component {
    constructor(props) {
        super(props);
        
        // generate one-time-use preimage/preimageHash
        const preimage = randomBytes(32);
        // console.log(`preimage: ${preimage.toString('hex')}`);
        const preimageHash = crypto.sha256(preimage);
        // console.log(`preimageHash: ${preimageHash}`);

        this.state = {
            message: [],
            modalIsOpen: false,
            claimAddress: '',
            stxAmount: '10',
            invoiceAmount: '...',
            invoiceAmountBTC: '...',
            preimage: preimage.toString('hex'),
            preimageHash: preimageHash.toString('hex'),
            rate: '30000',
            fee: '5',
            qrValue: 'invoice',
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
                            label="BTC/STX Rate"
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
                            <QRCode 
                                value={this.state.qrValue} 
                            />
                        </Box>
                        <Divider sx={{ m: 2 }} />
                        <CircularProgress sx={{ mx: 'auto', textAlign: 'center', display: 'block', margin: 'auto' }} />
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

    handleClose = () => {
        console.log(`closeModal `, this.state);
        this.setState({modalIsOpen: false});
    }
    setMessage(...message){
        console.log(`swapParams: `, message)
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
                console.log("getpairs: ", res);
                const rate = parseInt(res.pairs[pairId].rate);
                const maxLimit = res.pairs[pairId].limits.maximal;
                const minLimit = res.pairs[pairId].limits.minimal;
                const fee = res.pairs[pairId].fees.percentage;
                const invoiceAmount = parseInt((this.state.stxAmount / rate) * 100000000).toString();
                const invoiceAmountBTC = (this.state.stxAmount / rate).toFixed(8).toString();
                console.log(`setting fee, rate ${fee}, ${rate}, ${this.state.stxAmount}, ${invoiceAmount}, ${invoiceAmountBTC}`);
                
                // convert rate, populate UI
                this.setState({rate, fee, invoiceAmount, invoiceAmountBTC});
                
                // create swap and show LN invoice
                

                // $("#minted").text(parseInt(res.result.slice(-2), 16));
            })
            .catch(e => {
                console.log(`fetch error `, e);
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
        fetch(`${apiUrl}/createswap`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqbody)
            }).then(res => res.json())
            .then(res => {
                console.log("swap created: ", res);
                // $("#minted").text(parseInt(res.result.slice(-2), 16));
            });     
    }

};

export default Widget;