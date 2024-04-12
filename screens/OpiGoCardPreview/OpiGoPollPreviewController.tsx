//framework
import { IBlock } from "../../../../../framework/src/IBlock";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { Message } from "../../../../../framework/src/Message";
import { getStorageData } from "../../../../../framework/src/Utilities";
//library
import { CommonActions } from "@react-navigation/native";
//components
import { listOfPollType, setNavigatedInPolling } from "../../../../../components/src/Utils/service";
// Customizable Area End
export const configJSON = require("./../../config.js");
export interface Props {
  // Customizable Area Start
  navigation: any;
  route: any;
  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  pollType: any;
  apiData: any;
  companyDetail: any;
  timeHorizon: any;
  userData: any;
  isLoading: any;
  investment_type: any;
  up: boolean;
  activeTradeTime: boolean;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class OpiGoPollPreviewController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiPostPoll: string = ''
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    // Customizable Area Start.
    this.subScribedMessages = [
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];
    this.state = {
      pollType: [{ key: '', name: '' }],

      apiData: null,
      companyDetail: null,
      timeHorizon: null,
      investment_type: null,
      userData: null,

      isLoading: false,
      up: false,
      activeTradeTime: false

    }
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  compareMultipleStock = [{ name: "Rank Bullish to Bearish", key: 'bullish_to' }, { name: "Rank Bearish to Bullish", key: 'bearish_to' }]

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if (apiRequestCallId !== null) {
        if (apiRequestCallId == this.apiPostPoll) {
          this.setState({ isLoading: false })
          setNavigatedInPolling(false)
          if (responseJson.data) {
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
    // Customizable Area End
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  async componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.loadData()
    })
    let user = await getStorageData("USER_DATA")
    let fuser = JSON.parse(user)
    this.setState({ userData: fuser.data })
    this.loadData()
  }

  loadData = () => {
    const { params } = this.props.route
    this.setState({
      apiData: params.apidata,
      pollType: params.polltype,
      companyDetail: params.companyDetail,
      timeHorizon: params.timeHorizon,
      investment_type: params.investment_type
    })
    if (params.polltype.name == listOfPollType[0].name) {
      if (params.companyDetail[0].change.toString().charAt(0) == '-') {
        this.setState({ up: false })
      } else {
        this.setState({ up: true })
      }
    }
  }

  postData = async () => {
    this.setState({ isLoading: true })
    let token = await getStorageData('Token')
    const header = {
      "Content-Type": "application/json",
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiPostPoll = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createPoll
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(this.state.apiData)
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


