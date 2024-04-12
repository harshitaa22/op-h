// Customizable Area Start
import { BackHandler } from "react-native";
//framework
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { IBlock } from "../../../../../framework/src/IBlock";
import { Message } from "../../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { getStorageData } from "../../../../../framework/src/Utilities";
//library
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
//components
import { setEvent, setNavigatedInPolling } from "../../../../../components/src/Utils/service";
import { isNumberInRange } from "../../../../../components/src/utilitisFunction";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  route: any;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  selectedTimeHorizon: any;
  selectedUpside: any;
  prevData: any;
  upSides: any;
  downSides: any;
  time_period: any;
  sentiment: any;
  timeHorizon: any;

  isLoading: boolean;
  isLoadingData: boolean;
  isLoadingPotential: boolean;
  visiblePopUp: boolean;

  cardCreateError: string;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class ChannelFinalCardController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiUpSentiment: string = "";
  apiDownSentiment: string = "";
  apiTimePeriod: string = "";
  apiPostCard: string = "";
  backHandler: any;
  timeHorizon = "timeHorizon";
  PotentialUpside = "Potential Upside";
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    // Customizable Area Start.
    this.subScribedMessages = [
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage),
    ];

    this.state = {
      // Customizable Area Start
      selectedTimeHorizon: 0,
      selectedUpside: 0,

      prevData: null,

      upSides: [],
      downSides: [],
      timeHorizon: [],

      isLoading: false,
      isLoadingData: true,
      isLoadingPotential: true,
      visiblePopUp: false,

      sentiment: "",
      time_period: "",
      cardCreateError: "",
      // Customizable Area End
    };

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
    }
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
        if (apiRequestCallId == this.apiUpSentiment) {
          if (responseJson.errors) {
            return;
          } else {
            if (responseJson) {
              const { upsides } = responseJson;
              if (upsides && Array.isArray(upsides)) {
                let copiedData = [...upsides].map((item, index) => {
                  let range = item.name;
                  let rangeNumbers = range.match(/\d+/g);
                  let minValue = Math.min(...rangeNumbers);
                  let maxValue = Math.max(...rangeNumbers);
                  item.minValue = index == 0 ? minValue : minValue + 1;
                  item.maxValue =
                    index == 0
                      ? maxValue
                      : index == upsides.length - 1
                        ? 100
                        : maxValue + 1;
                  return item;
                });
                let auto_close_profit_percent = this.props.route.params.data
                  .auto_close_profit_percent;
                let auto_close_loss_percent = this.props.route.params.data
                  .auto_close_loss_percent;
                let selectedUpside = 0;
                console.log(
                  "auto_close_profit_percent",
                  auto_close_profit_percent
                );
                if (
                  auto_close_profit_percent &&
                  auto_close_profit_percent.trim() != ""
                ) {
                  copiedData.forEach((item, index) => {
                    let numberInRange = isNumberInRange(
                      parseFloat(auto_close_profit_percent),
                      item.minValue,
                      item.maxValue
                    );
                    if (numberInRange) {
                      selectedUpside = index;
                    }
                  });
                }
                this.setState({
                  upSides: responseJson.upsides,
                  downSides: responseJson.upsides,
                  isLoadingPotential: false,
                  selectedUpside: selectedUpside,
                });
              }
            }
          }
        } else if (apiRequestCallId == this.apiDownSentiment) {
          console.log("apiDownSentiment", responseJson);
          if (responseJson.errors) {
            return;
          } else {
            this.setState({ downSides: responseJson.downsides });
          }
        } else if (apiRequestCallId == this.apiTimePeriod) {
          if (responseJson.errors) {
            return;
          } else {
            this.setState({ timeHorizon: responseJson.periods });
          }
          this.setState({ isLoadingData: false });
        } else if (apiRequestCallId == this.apiPostCard) {
          setNavigatedInPolling(false);
          this.setState({ isLoading: false, visiblePopUp: false });
          if (responseJson.status == "error") {
            const card_error = responseJson.message
            if (card_error) {
              setTimeout(() => {
                Toast.show(card_error, Toast.SHORT, ["UIAlertController"]);
              }, 200);
              this.setState({ cardCreateError: card_error });
            }
            return;
          } else {
            let sendData = this.state.prevData;
            setEvent("deck card created", {
              "deck name": sendData?.selectedChannel,
              "deck ID": responseJson?.attributes?.channel_id,
              "stock name": responseJson?.attributes?.company_name,
              "caption": responseJson?.attributes?.description,
              "horizon": responseJson?.attributes?.time_period,
              "potential upside": responseJson?.attributes?.sentiment,
              "timestamp": responseJson?.attributes?.stock?.attributes?.timestamp
            })
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "MyTabs",
                    params: {
                      screen: "Analytics3",
                      params: {
                        screen: "Explore",
                        isCreateChannel: true,
                        account_channel_id: responseJson?.attributes?.channel_id,
                        id: responseJson?.attributes?.account_channel_id,
                        channelTitle: sendData?.selectedChannel,
                      },
                    },
                  },
                ],
              })
            );
          }
        }
      }
    }
    // Customizable Area End
  }

  async componentDidMount() {
    let token = await getStorageData("Token");
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
    this.loadData();
    this.getUpdentiment(token);
    // this.getDowndentiment(token)
    this.getTimePeriod(token);
    this.props.navigation.addListener("focus", () => {
      this.loadData();
      this.setState({ isLoadingData: true, isLoadingPotential: true }, () => {
        this.getUpdentiment(token);
        this.getTimePeriod(token);
      });
    });
    this.props.navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    });
  }

  backAction = (): any => {
    this.setState({ selectedTimeHorizon: 0, selectedUpside: 0 });
  };

  loadData = () => {
    this.setState({ prevData: this.props.route.params.data });
  };

  getTimePeriod = (token: any) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiTimePeriod = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getPointTimePeriod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  getUpdentiment = (token: any) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiUpSentiment = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getPointUpside
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  getDowndentiment = (token: any) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDownSentiment = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getPointDownside
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  goToPreView = () => {
    let data = this.state.prevData;
    data.Horizon = this.state.timeHorizon[this.state.selectedTimeHorizon];
    data.PotentialUpside =
      this.state.prevData?.price_movement == "bullish"
        ? this.state.upSides[this.state.selectedUpside]
        : this.state.downSides[this.state.selectedUpside];
    this.props.navigation.navigate("PreView", { data: data });
  };

  postCard = async () => {
    this.setState({ isLoading: true });
    const token = await getStorageData("Token");
    let sendData = this.state.prevData;
    let channeldata = JSON.stringify({
      data: {
        attributes: {
          description: sendData?.description,
          price_movement: "Bullish",
          time_period: this.state.time_period?.length > 0 ? this.state.time_period : this.state.timeHorizon[0].name,
          sentiment: this.state.sentiment?.length > 0 ? this.state.sentiment : this.state.upSides[0].name,
          stock_company_id: sendData?.stock_company_id,
          book_price: sendData?.book_price.replace(/''/g, ''),
          currency_name: sendData?.currency_name,
          is_auto_close: false,
          auto_close_profit_percent: "",
          auto_close_loss_percent: "",
          account_channel_id: sendData?.channel_id,
        },
      },
      card: {
      }
    })
    console.log("channeldatachanneldata", JSON.stringify(channeldata));

    const header = {
      "Content-Type": configJSON.httpApiContentType,
      Authorization: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiPostCard = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.postChannelCard
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      channeldata
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };
  // Customizable Area End
}
