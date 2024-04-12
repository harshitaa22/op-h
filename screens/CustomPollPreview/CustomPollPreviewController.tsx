// Customizable Area Start
import React from "react";
import { IBlock } from "../../../../../framework/src/IBlock";
import { Message } from "../../../../../framework/src/Message";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { CommonActions } from "@react-navigation/native";
import { getStorageData } from "../../../../../framework/src/Utilities";
import { setNavigatedInPolling } from "../../../../../components/src/Utils/service";
// Customizable Area End

export const configJSON = require("../CutomPoll/config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  route: any;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  options: any;
  userData: any;
  question: string;
  isPosting: boolean;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class CustomPollPreviewController extends BlockComponent<
  Props,
  S,
  SS
> {
  apiPostCustomPoll: string = ''
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      options: [],
      userData: null,
      question: '',
      isPosting: false
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (this.apiPostCustomPoll == apiRequestCallId) {
        if (responseJson) {
          this.setState({ isPosting: false })
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "MyTabs",
                  params: {
                    screen: 'Polling',
                    params: {
                      screen: "Polling",
                      params: {
                        navigateTo: "Polls"
                      }
                    }
                  }
                }
              ]
            })
          );
        }
      }
    }
  }
  goBack = () => {
    this.props.navigation.goBack()
  }

  async componentDidMount() {
    this.loadData()
    let user = await getStorageData("USER_DATA")
    let fuser = JSON.parse(user)
    this.setState({ userData: fuser.data })
    this.props.navigation.addListener('focus', () => {
      this.loadData()
    })
  }

  loadData = () => {
    let { data, question } = this.props.route.params
    this.setState({ options: data, question: question })
  }

  postPoll = async () => {
    this.setState({ isPosting: true })
    let token = await getStorageData("Token")
    let data: any = []
    this.state.options.map((item: any) => {
      data.push(item.input)
    })
    let body = {
      "poll_type": "custom_poll",
      "question": this.state.question,
      "stock_name": data
    }
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    setNavigatedInPolling(false)
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiPostCustomPoll = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createCustomPoll
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  // Customizable Area End

}
