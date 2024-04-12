// Customizable Area Start
//framework
import MessageEnum, {
  getName,
} from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { IBlock } from "../../../../../framework/src/IBlock";
import { Message } from "../../../../../framework/src/Message";
import { getStorageData } from "../../../../../framework/src/Utilities";
import { runEngine } from "../../../../../framework/src/RunEngine";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  route: any
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  pollData: any
  analytical_data: any
  iserror: any
  response_by_percentage: any
  singlePoll_response_by_percentage: any
  singlePoll_response_by_opigo_percentage: any
  singlePoll_keyData: any
  response_by_opigo_percentage_key: any

  isLoading: boolean
  isSelectAll: boolean

  poll_type: string
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class AnalyticsController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiGetPollanalyticsCallId: string = "";
  viewabilityConfig: any
  willFocusSubscription: any
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [getName(MessageEnum.RestAPIResponceMessage)];
    this.state = {
      // Customizable Area Start
      pollData: {},
      analytical_data: {},
      response_by_percentage: {},

      iserror: '',
      poll_type: '',

      isLoading: true,
      isSelectAll: true,

      singlePoll_response_by_percentage: [],
      singlePoll_response_by_opigo_percentage: [],
      singlePoll_keyData: [],
      response_by_opigo_percentage_key: []
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };
  }

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
        if (apiRequestCallId === this.apiGetPollanalyticsCallId) {
          if (responseJson.errors) {
            this.setState({ iserror: 'Psst...No votes received yet!', isLoading: false })
          }
          else {
            let poll_type = responseJson?.data?.poll?.data?.attributes?.poll_type
            let obj2 = undefined, obj3 = undefined
            const obj1 = responseJson?.data?.poll?.data?.attributes?.response_by_percentage

            if (poll_type != undefined && poll_type === "custom_poll") {
              obj2 = responseJson?.data?.poll?.data?.attributes?.analytics_for_custom_poll
              obj3 = responseJson?.data?.poll?.data?.attributes?.response_by_percentage
            } else {
              obj2 = responseJson?.data?.poll?.data?.attributes?.poll_stocks?.data[0]?.attributes?.stock?.response_by_opigo_percentage
              obj3 = responseJson?.data?.poll?.data?.attributes?.poll_stocks?.data[0]?.attributes?.stock?.response_by_percentage
            }
            this.setState({
              pollData: responseJson?.data?.poll?.data,
              analytical_data: responseJson?.data?.analytical_data?.data,
              isLoading: false,
              response_by_percentage: responseJson?.data?.poll?.data?.attributes?.response_by_percentage,
              poll_type: poll_type,
              singlePoll_keyData: obj1 ? Object.keys(obj1) : [],
              response_by_opigo_percentage_key: obj2 ? poll_type != undefined && poll_type === "custom_poll" ? obj2.map((value: any) => value.name) : Object.keys(obj2) : [],
              singlePoll_response_by_percentage: obj3 ? obj3 : [],
              singlePoll_response_by_opigo_percentage: obj2 ? obj2 : []
            }, () => {
              console.log('this.state.response_by_opigo_percentage_key', this.state.response_by_opigo_percentage_key, this.state.poll_type)
            })
          }
        }
      }
      // Customizable Area End
    }
  }
  async componentDidMount() {
    this.getPollanalytics()
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        this.getPollanalytics()
      })

    this.props.navigation.addListener(
      "blur",
      () => {
        this.setState({ pollData: {}, analytical_data: {}, iserror: '', isLoading: true })
      })

  }

  getPollanalytics = async () => {
    let id = this.props.route.params.id
    const token = await getStorageData("Token");
    let endPoint = configJSON.getPollanalyticsEndPoint + id + "/analytics"
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetPollanalyticsCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpApiMethodType
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  getWidth = (name: any) => {
    console.log("name", name, this.state.response_by_percentage)
    console.log((name) in this.state.response_by_percentage)
    if ((name) in this.state.response_by_percentage)
      return `${this.state.response_by_percentage[name]}%`
  }

  getAllData = (name: any, type: any) => {
    console.log((name) in this.state.singlePoll_response_by_percentage)
    if ((name) in this.state.singlePoll_response_by_percentage)
      console.log("getAllData", this.state.singlePoll_response_by_percentage[name])
    let data = "0"
    if (this.state.poll_type === "custom_poll") {
      data = type = "bg" ? this.state.singlePoll_response_by_percentage[name] : `${this.state.singlePoll_response_by_percentage[name]}%`
    } else {
      data = type = "bg" ? this.state.singlePoll_response_by_percentage[name] : `${this.state.singlePoll_response_by_percentage[name]}%`
    }
    return data ? Number(data).toFixed(2) : "0.00"
  }

  getopigo_percentage = (name: any, type: any) => {
    console.log('name', name, this.state.singlePoll_response_by_opigo_percentage[name])
    console.log((name) in this.state.singlePoll_response_by_opigo_percentage)
    if ((name) in this.state.singlePoll_response_by_opigo_percentage)
      console.log("getopigo_percentage", this.state.singlePoll_response_by_opigo_percentage[name])
    let data;
    if (this.state.poll_type === "custom_poll") {
      data = type = "bg" ? this.state.singlePoll_response_by_opigo_percentage.find((item: any) => item.name === name).verified_opigo_votes : `${this.state.singlePoll_response_by_opigo_percentage[name]}%`
    } else {
      data = type = "bg" ? this.state.singlePoll_response_by_opigo_percentage[name] : `${this.state.singlePoll_response_by_opigo_percentage[name]}%`
    }
    return Number(data).toFixed(2)
  }

  goToBack = () => {
    this.props.navigation.goBack()
  }
  // Customizable Area End
}
