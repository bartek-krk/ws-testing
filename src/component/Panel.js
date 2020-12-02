import { Component } from "react";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


class Panel extends Component {
    constructor(props) {
        super(props);

        this.stompClient = undefined;

        this.state = {
            "ws_endpoint_url":"",
            "send_to":"",
            "fetch_from":"",
            "message":"",
            "syntax_ok":true,
            "error_msg":"",
            "message_list":[]
        };

        this.wsEndpointChange = this.wsEndpointChange.bind(this);
        this.sendToChange = this.sendToChange.bind(this);
        this.fetchFromChange = this.fetchFromChange.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.onSyntaxDetails = this.onSyntaxDetails.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.errorCallBack = this.errorCallBack.bind(this);
        this.onDisonnect = this.onDisonnect.bind(this);
    }

    wsEndpointChange(event){
        this.setState({
            "ws_endpoint_url":event.target.value
        });
    }

    sendToChange(event){
        this.setState(
            {
                "send_to":event.target.value
            }
        );
    }

    fetchFromChange(event){
        this.setState(
            {
                "fetch_from":event.target.value,
            }
        );
    }

    onConnect(event){
        let ws = new SockJS(this.state.ws_endpoint_url);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.state.fetch_from, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
        }, this.errorCallBack);
    }

    onDisonnect(event){
        this.stompClient.disconnect();
    }

    onMessageReceived(message){
        var newList = this.state.message_list;
        newList.push(JSON.stringify(message));
        this.setState(
            {
                "message_list":newList
            }
        );
        console.log(this.state.message_list);
    }

    errorCallBack() {
        console.log("error occurrred");
    }

    messageChange(event){
        try{
            var messy = document.getElementById("message-box").value;
            var obj = JSON.parse(messy);
            var pretty = JSON.stringify(obj, undefined, 4);
            document.getElementById("message-box").value = pretty;
            this.setState({
                "syntax_ok":true
            });
        }
        catch (error) {
            this.setState({
                "syntax_ok":false,
                "error_msg":error
            });
        }

        this.setState(
            {
                "message":event.target.value,
            }
        );
    }

    onSyntaxDetails(event){
        alert(`Following error message was thrown: "${ this.state.error_msg}"`);
    }

    onSend(event){
        this.stompClient.send(this.state.send_to, {}, this.state.message)
    }

    render() {
        return(
            <div className="panel">
                <div className="connect-form">
                    <input placeholder="WS endpoint URL" onChange={this.wsEndpointChange}></input>
                    <input placeholder="Send to" onChange={this.sendToChange}></input>
                    <input placeholder="Fetch from" onChange={this.fetchFromChange}></input>
                    <button onClick={this.onConnect}>Connect</button>
                    <button>Disconnect</button>
                </div>
                <div className="send-form">
                    <textarea id="message-box" placeholder="Message" onChange={this.messageChange}></textarea>
                    <button id="check-syntax-btn" onClick={this.onSyntaxDetails} disabled={this.state.syntax_ok}>{this.state.syntax_ok ? "Syntax OK" : "Syntax Error (details)"}</button>
                    <button onClick={this.onSend} disabled={!this.state.syntax_ok}>Send</button>
                </div>
            </div>
        );
    }
}

export default Panel;