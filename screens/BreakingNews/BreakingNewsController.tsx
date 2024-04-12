// Customizable Area Start
//framework
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { Message } from "../../../../../framework/src/Message";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import { getStorageData } from "../../../../../framework/src/Utilities";
//library
import moment from "moment";
//component
import { setEvent } from "../../../../../components/src/Utils/service";
import { BackHandler } from "react-native";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  route: any;

  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  selected_tab: string;
  token: string;

  isLoadingNews: boolean;
  isLoading: boolean

  header: any;
  newsData: any
  businessNewsData: any
  entartainmentNewsData: any
  politicsNewsData: any
  worldNewsData: any
  categoryNewsData: any

  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

let categoryType = "top";

export default class BreakingNewsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  viewabilityConfig: any
  _unsubscribe: any;
  apitagNewsCalledId: string = ""

  constructor(props: Props) {
    super(props);

    this.receive = this.receive.bind(this);
    this.subScribedMessages = [
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage)
    ];

    this.state = {
      newsData: null,
      businessNewsData: null,
      entartainmentNewsData: null,
      politicsNewsData: null,
      worldNewsData: null,
      header: null,

      categoryNewsData: [],

      isLoadingNews: false,
      isLoading: false,

      selected_tab: 'top',
      token: "",
    }
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }
  // Customizable Area Start
  tabRef: any
  mainRef: any
  newsList: any


  async receive(from: string, message: Message) {
    // 

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
        if (apiRequestCallId == this.apitagNewsCalledId) {
          this.setState({ isLoadingNews: false, isLoading: false })
          if (responseJson && responseJson.error) {
            return
          } else {
            if (categoryType == "top") {
              this.setState({ newsData: responseJson.data, categoryNewsData: responseJson.data, isLoadingNews: false });
              categoryType = "business";
              this.getBrekingNewsList(categoryType)
            }
            else if (categoryType == "business") {
              this.setState({ businessNewsData: responseJson.data, isLoadingNews: false });
              categoryType = "entertainment";
              this.getBrekingNewsList(categoryType)
            }
            else if (categoryType == "entertainment") {
              this.setState({ entartainmentNewsData: responseJson.data, isLoadingNews: false });
              categoryType = "politics";
              this.getBrekingNewsList(categoryType)
            }
            else if (categoryType == "politics") {
              this.setState({ politicsNewsData: responseJson.data, isLoadingNews: false });
              categoryType = "world";
              this.getBrekingNewsList(categoryType)
            }
            else if (categoryType == "world") {
              this.setState({ worldNewsData: responseJson.data, isLoadingNews: false });
            }
          }
        }
      }
    }
    // Customizable Area End

  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    categoryType = "top"
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      let header = this.props.route?.params?.header;
      const token = await getStorageData("Token");
      this.setState({
        header: this.props.route?.params?.header,
        token: token,
        isLoadingNews: true,
      });
      this.getBrekingNewsList(categoryType);
      setEvent("daily news screen", null)
    });
  }

  async componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };

  getDateTimeFormate = (date: any) => {
    const formattedDate = moment(date).format('MMM DD YYYY, HH:mm');
    return formattedDate
  }

  getBrekingNewsList = async (category: any) => {
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      Authorization: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apitagNewsCalledId = requestMessage.messageId;
    let endPoint = configJSON.breackingNewsList + category;
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
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  goBack = () => {
    this.props.navigation.goBack()
  }

  onMoveToPreview = (link: any) => {
    this.props.navigation.navigate('BreakingNewsPreview', { url: link, header: this.state.selected_tab })
  }

  // Customizable Area End
  onViewableItemsChanged = (props: any) => {
    if (props.viewableItems[0].index == 0 || props.viewableItems[0].index == 1) {
      this.tabRef.scrollToOffset({ offset: 0, animated: true })
    } else if (props.viewableItems[0].index >= 2) {
      this.tabRef.scrollToOffset({ offset: props.viewableItems[0].index * 50, animated: true })
    } else {
      this.tabRef.scrollToOffset({ offset: props.viewableItems[0].index * 20, animated: true })
    }
    if (props.viewableItems[0].index == 0) {
      this.setState({ categoryNewsData: this.state.newsData }, () => {
        this.setState({ selected_tab: 'For you', })
      })
    }
    else if (props.viewableItems[0].index == 1) {
      this.setState({ categoryNewsData: this.state.businessNewsData }, () => {
        this.setState({ selected_tab: 'Business' })
      })
    }
    else if (props.viewableItems[0].index == 2) {
      this.setState({ categoryNewsData: this.state.entartainmentNewsData }, () => {
        this.setState({ selected_tab: 'Entertainment' })
      })
    }
    else if (props.viewableItems[0].index == 3) {
      this.setState({ categoryNewsData: this.state.politicsNewsData }, () => {
        this.setState({ selected_tab: 'Politics' })
      })
    } else if (props.viewableItems[0].index == 4) {
      this.setState({ categoryNewsData: this.state.worldNewsData }, () => {
        this.setState({ selected_tab: 'World' })
      })
    }
  }

}

