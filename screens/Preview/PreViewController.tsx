// Customizable Area Start
//framework
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { Message } from "../../../../../framework/src/Message";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import { getStorageData } from "../../../../../framework/src/Utilities";
//library
import { CommonActions } from '@react-navigation/native'
//components
import { setNavigatedInPolling } from "../../../../../components/src/Utils/service";
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
  data: any,
  userDetail: any,
  isLoading: boolean,
  up: boolean,
  activeTradeTime: boolean,
  visiblePopUp: boolean
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class PreViewController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiPostCard: string = ""
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage)
    ];
    this.state = {
      data: null,
      userDetail: null,

      isLoading: false,
      up: false,
      activeTradeTime: false,
      visiblePopUp: false
    }
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) { }
    if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (apiRequestCallId !== null) {
        if (apiRequestCallId == this.apiPostCard) {
          this.setState({ isLoading: false, visiblePopUp: false })
          setNavigatedInPolling(false)
          if (responseJson && responseJson.error) {
            return
          } else {
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
                          navigateTo: "Cards"
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

  async componentDidMount() {
    let userDetail = await getStorageData("USER_DATA")
    let fData = JSON.parse(userDetail)
    this.setState({ userDetail: fData.data })
    this.loadData()
    this.props.navigation.addListener('focus', () => {
      this.loadData()
    })
  }

  loadData = async () => {
    // let time = await marketLiveTime()    
    // this.setState({ activeTradeTime: time })
    let data = this.props.route.params.data
    if (data.stockDetail.change.toString().charAt(0) == '-') {
      this.setState({ up: false })
    } else {
      this.setState({ up: true })
    }
    this.setState({ data: [this.props.route.params.data] })
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  PostData = async () => {
    this.setState({ isLoading: true })
    const token = await getStorageData("Token");
    let sendData = this.state.data[0]
    let data = {
      data: {
        attributes: {
          description: sendData.discription,  //done
          market_name: sendData.stockDetail.exchange, //done
          market_category: sendData.category.name, // market catogary
          price_movement: sendData.bulish_barish.name, //done
          time_period: sendData.Horizon.name, //done 
          sentiment: sendData.PotentialUpside.name, //done
          stock_company_id: sendData.stockDetail.stock_company_id, // change this one
          book_price: sendData.stockDetail.market_cap, //done
          currency_name: sendData.stockDetail.currency_name, //done
          company_code: sendData.stock.symbol,
          company_name: sendData.stockDetail.name
        }
      }
    }
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
      configJSON.getPointMarketCategory
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
  }
  // Customizable Area End
}

