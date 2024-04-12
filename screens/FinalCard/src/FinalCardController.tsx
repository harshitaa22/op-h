import moment from "moment";
import { BlockComponent } from "../../../../../../framework/src/BlockComponent";
import { IBlock } from "../../../../../../framework/src/IBlock";
import { Message } from "../../../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../../framework/src/RunEngine";
import { getStorageData } from "../../../../../../framework/src/Utilities";
import { CommonActions } from "@react-navigation/native";
import { setEvent, setNavigatedInPolling } from "../../../../../../components/src/Utils/service";
import { BackHandler } from "react-native";
import Toast from "react-native-simple-toast";
import { isNumberInRange } from "../../../../../../components/src/utilitisFunction";

// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  route: any;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  selectedTimeHorizon: any;
  selectedUpside: any;
  prevData: any;
  upSides: any;
  downSides: any;
  timeHorizon: any;
  isLoading: boolean;
  isLoadingData: boolean;
  isLoadingPotential: boolean;
  visiblePopUp: boolean;
  cardCreateError: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class FinalCardController extends BlockComponent<Props, S, SS> {
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
      // Customizable Area Start
      // Customizable Area End
    ];

    // Customizable Area End
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
      cardCreateError: "",
      // Customizable Area End
    };

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      // const data = message.getData(getName(MessageEnum.PropsData));
      // let parsedData = JSON.parse(data)
      // this.setState({ prevData: parsedData })
    }
    // Customizable Area Start
    // runEngine.debugLog("Message Recived in Post page:", message);

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
                console.log(
                  "copiedData",
                  responseJson.upsides,
                  copiedData,
                  selectedUpside
                );
                this.setState({
                  upSides: responseJson.upsides,
                  // downSides: responseJson.upsides,
                  isLoadingPotential: false,
                  selectedUpside: selectedUpside,
                });
              }
            }
          }

          // this.setState({upSide:})
        } else if (apiRequestCallId == this.apiDownSentiment) {
          console.log("apiDownSentimentapiDownSentiment", responseJson);

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
          if (responseJson.errors) {
            const { card_error, base } = responseJson.errors[0];

            // const card_error = responseJson?.errors
            // const base = responseJson?.errors
            if (card_error) {
              setTimeout(() => {
                Toast.show(card_error, Toast.SHORT, ["UIAlertController"]);
              }, 200);
              this.setState({ cardCreateError: card_error });
            }
            if (base) {
              setTimeout(() => {
                Toast.show(base, Toast.SHORT, ["UIAlertController"]);
              }, 200);
              this.setState({ cardCreateError: base });
            }
            return;
          } else {
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "MyTabs",
                    params: {
                      screen: "Polling",
                      params: {
                        screen: "Polling",
                        params: {
                          navigateTo: "Cards",
                        },
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
    this.getDowndentiment(token)
    this.getTimePeriod(token);

    this.props.navigation.addListener("focus", () => {
      this.loadData();
      this.setState({ isLoadingData: true, isLoadingPotential: true }, () => {
        this.getUpdentiment(token);
        this.getDowndentiment(token)
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
      this.state.prevData?.bulish_barish?.key == "bullish"
        ? this.state.upSides[this.state.selectedUpside]
        : this.state.downSides[this.state.selectedUpside];
    this.props.navigation.navigate("PreView", { data: data });
  };

  postCard = async () => {
    this.setState({ isLoading: true });
    const token = await getStorageData("Token");

    let sendData = this.state.prevData;


    let data = {
      data: {
        attributes: {
          description: sendData.discription,
          market_name: sendData.stockDetail.exchange,
          market_category: sendData.category.name,
          price_movement: sendData.bulish_barish.name,
          time_period: this.state.timeHorizon[this.state.selectedTimeHorizon]
            .name,
          sentiment:
            this.state.prevData?.bulish_barish?.key == "bullish"
              ? this.state.upSides[this.state.selectedUpside].name
              : this.state.downSides[this.state.selectedUpside].name,
          stock_company_id: sendData.stockDetail.stock_company_id,
          book_price: sendData.stockDetail.market_cap,
          currency_name: sendData.stockDetail.currency_name,
          company_code: sendData.stock.symbol,
          company_name: sendData.stockDetail.name,
          is_auto_close: sendData.is_auto_close,
          auto_close_profit_percent: sendData.auto_close_profit_percent,
          auto_close_loss_percent: sendData.auto_close_loss_percent,
          type_of: sendData.type_of.key
        },
      },
    };
    this.state.prevData?.bulish_barish?.key == "bullish" ?
      setEvent("card created", {
        "stock name": sendData.stockDetail.currency_name,
        "bullish": sendData.bulish_barish.name,
        "caption": sendData.discription,
        "stock price": sendData.stockDetail.market_cap,
        "reward y/n": sendData.type_of.key,
        "duration": this.state.timeHorizon[this.state.selectedTimeHorizon].name,
        "potential upside": this.state.upSides[this.state.selectedUpside].name,
        "once in a day y/n": "once in a day y/n"
      }) :
      setEvent("card created", {
        "stock name": sendData.stockDetail.currency_name,
        "bearish": sendData.bulish_barish.name,
        "caption": sendData.discription,
        "stock price": sendData.stockDetail.market_cap,
        "reward y/n": sendData.type_of.key,
        "duration": this.state.timeHorizon[this.state.selectedTimeHorizon].name,
        "potential upside": this.state.downSides[this.state.selectedUpside].name,
        "once in a day y/n": "once in a day y/n"
      })

    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiPostCard = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.postCard
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
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
