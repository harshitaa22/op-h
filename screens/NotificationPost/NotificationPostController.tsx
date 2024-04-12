// Customizable Area Start
import { AppState, Keyboard, Linking } from "react-native";
import { AuthContext } from '../../../../../mobile/Navigation/context';
//framework
import { IBlock } from "../../../../../framework/src/IBlock";
import { Message } from "../../../../../framework/src/Message";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { deviceWidth, getStorageData, logoutUser } from "../../../../../framework/src/Utilities";
//library
import { replaceMentionValues } from "react-native-controlled-mentions";
//components
import { listOfPollType, setEvent, validURL } from "../../../../../components/src/Utils/service";
// Customizable Area End

export const configJSON = require('../../config');

export interface Props {
  // Customizable Area Start
  navigation: any;
  route: any;
  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  card_comments_api: string;
  comment: string;
  cardID: string;
  commentType: string;
  openViewCommentID: string;
  replyId: string;
  accountid: string;
  type: string;
  accountId: string;
  token: string;
  normalComment: string;
  error: string;

  isLoading: boolean;
  isShow: boolean;
  isHideComments: boolean;
  scrolled: boolean;
  refreshing: boolean;
  isScreenLoad: boolean;
  temp: boolean;
  visibleModal: boolean;
  isCommentLoading: boolean;
  heighLight: boolean;
  isChannelCardLoad: boolean;
  visibleMenu: boolean;
  deleteCommentLoading: boolean;
  isLoadingReplyComment: boolean;
  isCreator: boolean;
  canSendComment: boolean;
  submitLoading: boolean;
  visibleSocialPopUp: boolean;
  visiblePopupReports: boolean;
  visibleMenuReport: boolean;
  visiblePopup: boolean;
  visibleForumMenu: boolean;
  isCardLoad: boolean;
  isPollLoad: boolean;
  isPostLoad: boolean;
  isForamLoad: boolean;

  comments_List: any;
  viewComment_List: any;
  replyItem: any;
  suggestions: any;
  keyboardHeight: any;
  mentionedId: any;
  compareDetails: any;
  deleteId: any;
  deleteAccountId: any;
  width: any;
  parentId: any;
  detail: any;
  seletctedDeleteId: any;
  showMoreId: any;

  selectedPoll: number;
  // Customizable Area End
}
interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class NotificationPostController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  static contextType = AuthContext;
  apiGetAllCardsCommentsCallId: string = ""
  apiCommentCallId: string = ""
  apiDeleteCommentCallId: string = ""
  apiViewAllRepliesCommentCallId: string = ""
  apisendReplyCommentCallId: string = ""
  apitagSearchPeopleCalledId: string = ""
  apiCreateAnswerId: string = ''
  apiDeleteforumComment: string = ''

  stockCompany: string = 'StockCompany'
  accountBlock: string = 'account_block'
  backHandler: any
  listRef: any
  innerCommentRef: any
  refss: any

  //post data
  apiGetPost: string = '';
  apiGetPoll: string = '';
  apiGetCard: string = '';
  apiGetChannelCard: string = '';
  createAns: string = '';
  apiGetForum: string = '';
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage)
    ];
    // Customizable Area End
    this.state = {
      // Customizable Area Start
      card_comments_api: '',
      comment: '',
      cardID: '',
      openViewCommentID: '',
      replyId: '',
      accountid: '',
      commentType: '',
      type: '',
      deleteId: '',
      token: '',
      width: '99.9%',
      deleteAccountId: '',
      normalComment: '',
      error: '',
      accountId: '',

      isLoading: true,
      isCommentLoading: false,
      isShow: false,
      visibleMenu: false,
      isScreenLoad: false,
      isHideComments: true,
      scrolled: false,
      heighLight: false,
      temp: false,
      visibleModal: false,
      refreshing: false,
      isLoadingReplyComment: false,
      isCreator: false,
      canSendComment: false,
      deleteCommentLoading: false,
      visibleSocialPopUp: false,
      visibleMenuReport: false,
      visiblePopupReports: false,
      submitLoading: false,
      visibleForumMenu: false,
      isCardLoad: true,
      isChannelCardLoad: true,
      isPollLoad: true,
      isPostLoad: true,
      isForamLoad: true,
      visiblePopup: false,

      comments_List: [],
      viewComment_List: [],
      suggestions: [],
      mentionedId: [],
      compareDetails: [],

      replyItem: {},

      keyboardHeight: 0,
      seletctedDeleteId: -1,
      selectedPoll: -1,

      parentId: null,
      detail: null,
      showMoreId: null,
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
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (apiRequestCallId !== null) {
        //get comment data --- delete after set data on post
        if (apiRequestCallId === this.apiGetAllCardsCommentsCallId) {
          if (this.state.commentType == "Forum") {
            if (responseJson) {
              const { errors, data } = responseJson
              if (errors) {
                this.setState({ isLoading: false, comments_List: [], isScreenLoad: false })
                return
              }
              if (data) {
                this.setState({ comments_List: data.reverse(), heighLight: true })
              }
              setTimeout(() => {
                this.setState({ heighLight: false })
              }, 2000);
            }
          } else {
            responseJson?.new_comments?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            if (this.state.parentId) {
              let index = responseJson?.new_comments?.findIndex((data: any) => data.id == this.state.parentId)
              if (index != -1) {
                this.setState({ openViewCommentID: this.state.parentId, isHideComments: false })
                this.viewReplyCommentes(this.state.parentId)
              }
            }
            else {
              let index = responseJson?.new_comments?.findIndex((data: any) => data.id == this.props?.route?.params?.details?.commentId)
              if (index != -1) {
                this.setState({ heighLight: true })
                setTimeout(() => {
                  this.listRef && this.listRef.scrollTo({
                    x: 0,
                    y: index * 85,
                    animated: true,
                  })
                }, 100);
                setTimeout(() => {
                  this.setState({ heighLight: false })
                }, 2000);
              }
            }
            this.setState({ comments_List: responseJson.new_comments, cardID: responseJson.id })
          }
          if (responseJson?.new_comments?.length == 0) {
            this.setState({ error: 'No comment available!' })
          }
          this.setState({ isLoading: false, })
        }
        // post commnet
        if (apiRequestCallId === this.apiCommentCallId) {

          if (responseJson.data) {
            responseJson.data.attributes.account.final_score = responseJson.data.attributes.opigo_score
            responseJson.data.attributes.account.profile_url = responseJson.data.attributes.profile_url
            this.setState({ comment: "", isShow: false, isCommentLoading: false, mentionedId: [], comments_List: [responseJson.data.attributes, ...this.state.comments_List,], })
          } else {
            this.setState({ isCommentLoading: false })
          }
          Keyboard.dismiss()
        }
        if (apiRequestCallId === this.apiDeleteCommentCallId) {
          let temp = this.state.comments_List
          let index = temp.findIndex((item: any) => this.state.deleteId == item.id)
          if (index != -1) {
            temp.splice(index, 1)
            this.setState({ comments_List: temp })
          }
          else {
            let temp = this.state.viewComment_List
            let index = temp.findIndex((item: any) => this.state.deleteId == item.id)
            if (index != -1) {
              temp.splice(index, 1)
              this.setState({ viewComment_List: temp })
            }
          }
          this.setState({ deleteCommentLoading: false, visibleModal: false })
        }
        if (apiRequestCallId === this.apiViewAllRepliesCommentCallId) {
          if (responseJson.data) {
            this.setState({ viewComment_List: responseJson.data, isLoadingReplyComment: false })
            if (this.state.parentId) {
              let mainIndex = this.state.comments_List.findIndex((item: any) => item.id == this.state.parentId)
              let index = responseJson.data.findIndex((data: any) => data.id == this.props?.route?.params?.details?.commentId)
              if (index != -1) {
                this.setState({ heighLight: true })
                setTimeout(() => {
                  this.listRef && this.listRef.scrollTo({
                    x: 0,
                    y: index,
                    animated: true,
                  })
                  this.innerCommentRef && this.innerCommentRef.scrollToIndex({ index: index, animated: true })
                }, 100);
                setTimeout(() => {
                  this.props.navigation.setParams({ commentId: null })
                  this.setState({ heighLight: false })
                }, 2000);
              }
            }
          }
          else {
            this.setState({ isLoadingReplyComment: false })
          }
        }
        if (apiRequestCallId === this.apisendReplyCommentCallId) {

          let temp = this.state.comments_List
          const item = temp.find((item: any) => item.id == this.state.replyId)
          item.is_replies_present = true
          this.viewReplyCommentes(this.state.replyId)
          this.setState({ isShow: false, replyId: '', comment: '', isCommentLoading: false, mentionedId: [] })
        }
        if (apiRequestCallId == this.apitagSearchPeopleCalledId) {
          // if (responseJson.length>0) {
          this.setState({ suggestions: responseJson })
          // }
        }
        if (apiRequestCallId == this.apiCreateAnswerId) {
          this.setState({ isCommentLoading: false })
          if (responseJson.data) {
            this.state.comments_List.splice(0, 0, responseJson.data)
            this.setState({ comment: '', mentionedId: [] })
          }
        }
        if (apiRequestCallId == this.apiDeleteforumComment) {
          if (responseJson.message) {
            let index = this.state.comments_List.findIndex((data: any) => data.attributes.id == this.state.deleteId)
            if (index != -1) {
              this.state.comments_List.splice(index, 1)
            }
            this.setState({ temp: !this.state.temp })
          }
          this.setState({ deleteCommentLoading: false, visibleModal: false })
        }
        //POST
        if (apiRequestCallId == this.apiGetPost) {
          if (responseJson.message) {
            this.setState({ isLoading: false, isPostLoad: false })
            return
          }
          if (responseJson) {
            this.setState({ detail: responseJson, isLoading: false })
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                this.context.authContext.signOut()
                return
              }
              return
            }
          }
          else {
            this.setState({ isLoading: false, detail: null })
          }
        }
        else if (apiRequestCallId == this.apiGetPoll) {
          if (responseJson.errors) {
            this.setState({ isLoading: false, isPollLoad: false })
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                this.context.authContext.signOut()
                return
              }
              return
            }
            return
          }
          if (responseJson.data) {
            this.setState({ detail: responseJson.data, isLoading: false })
          }
          else {
            this.setState({ isLoading: false, detail: null })
          }
        }
        else if (apiRequestCallId == this.apiGetCard) {
          console.log("apiGetCardapiGetCard", JSON.stringify(responseJson));
          if (responseJson && responseJson.data) {
            return this.setState({ isLoading: false, isCardLoad: false, detail: responseJson.data })
          }
          else {
            this.setState({ isLoading: false, detail: null })
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                this.context.authContext.signOut()
                return
              }
              return
            }
          }
        }
        else if (apiRequestCallId == this.apiGetChannelCard) {
          if (responseJson && responseJson.attributes) {
            return this.setState({ isLoading: false, isChannelCardLoad: false, detail: responseJson })
          }
          else {
            this.setState({ isLoading: false, detail: null })
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                this.context.authContext.signOut()
                return
              }
              return
            }
          }
        }
        else if (apiRequestCallId == this.apiGetForum) {
          this.setState({ isLoading: false, detail: responseJson.data, isForamLoad: false })
        }
        if (apiRequestCallId == this.createAns) {
          if (responseJson) {
            let temp = this.state.detail
            let data = {
              data: responseJson.data
            }
            temp.attributes.can_register_my_response = false
            temp.attributes.current_user_answers = data
            // temp.attributes.response_by_percentage = responseJson.meta.final_response
            temp.attributes.new_response_by_percentage = responseJson.meta.new_final_response
            temp.attributes.no_of_response = temp.attributes.no_of_response ? Number(temp.attributes.no_of_response) + 1 : 1
            this.setState({ temp: !this.state.temp })
            this.setState({ submitLoading: false })
          }
          else if (responseJson.errors) {
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token, user } = errors[0]
              if (token) {
                logoutUser("force")
                this.context.authContext.signOut()
                return
              }
              if (user) {
                alert(user)
              }
              return
            }
            this.setState({ submitLoading: false })
          }
        }
      }
    }
  }


  _handleOpenURL = async () => {

    let { item: details, details: navigationDetails } = this.props.route.params
    let newDetails = Object.assign({}, details);
    console.log("newDetailsnewDetails", newDetails);


    if (Object.keys(details).find(key => key.toLowerCase() === "redirection_url")) {
      if (details["redirection_screen"] === "link") {

        let isCardTypeLink = details["redirection_url"].includes("bx_block_share_card/card");
        let isShareAccount = details["redirection_url"].includes("share_account");
        let isPollTypeLink = details["redirection_url"].includes("bx_block_share_poll/poll");
        let isInviteTypeLink = details["redirection_url"].includes("invite");
        let isPostTypeLink = details["redirection_url"].includes("bx_block_posts/post_detail");
        let isChannelLink = details["redirection_url"].includes("api/v1/channels/cards");
        if (isCardTypeLink) {
          let card_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["card_id"] = card_id
        } else if (isPollTypeLink) {
          let poll_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["poll_id"] = poll_id
        } else if (isPostTypeLink) {
          let post_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["post_id"] = post_id
        }
        else if (isChannelLink) {
          let channel_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["post_id"] = channel_id
        }
      }
    }
    this.loadDetails(newDetails, navigationDetails)
  }
  // Customizable Area End

  handleAppStateChange = (state) => {
    // Work your magic!
    console.log("statestate", state);

    if (
      state === 'active'
    ) {
      console.log("nextAppState12112121212121");
      this.setState({ isLoading: true })
      let { item: details, details: navigationDetails } = this.props.route.params
      this.getCardCommentsData(this.props.route.params.details.data)

      let newDetails = Object.assign({}, details);
      console.log("newDetails", newDetails);

      this.loadDetails(newDetails, navigationDetails)

    }


  }

  handleAppStateChangeCall = (state) => this.handleAppStateChange(state);
  clearAppStateListener() {
    AppState.addEventListener("change", this.handleAppStateChangeCall);
  }
  setupAppStateListener() {
    AppState.addEventListener("change", this.handleAppStateChangeCall);
  }
  componentDidMount = async () => {
    console.log("backgroundd");
    this.setState({ isLoading: true })
    this.initialData();

    // this.props.navigation.addListener(
    //   "focus",
    //   () => {
    //     this.setState({ isLoading: true })
    //     this.setState({ visibleSocialPopUp: false })
    //     console.log("backgroundd focus");
    //     this.initialData();
    //   })
    // AppState.addEventListener(
    //   'change',
    //   async nextAppState => {
    //     if (
    //       nextAppState === 'active'
    //     ) {
    //       console.log("nextAppState");
    //       this.setState({ isLoading: true })
    //       this.initialData();
    //     } else {
    //     }
    //   },
    // );

    this.setupAppStateListener()
  }

  async componentWillUnmount() {
    this.clearAppStateListener()
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  initialData = async () => {
    // Linking.addEventListener("url", this._handleOpenURL);
    let { item: details, details: navigationDetails } = this.props.route.params
    console.log("this.props.route.params", this.props.route.params);

    setTimeout(() => {
      this.setState({ width: deviceWidth - 140 })
    }, 0);
    const accountid = await getStorageData("AccountID");
    const token = await getStorageData('Token')
    this.setState({ accountid: accountid, type: this.props.route.params.type, scrolled: false, isLoading: false, token: token })
    //@ts-expect-error
    this.context.authContext.setTabBar(false)
    this.setBasicDetails(this.props.route.params.details.data)


    let newDetails = Object.assign({}, details);
    console.log("newDetails", newDetails);

    if (Object.keys(details).find(key => key.toLowerCase() === "redirection_url")) {
      if (details["redirection_screen"] === "link") {
        let isCardTypeLink = details["redirection_url"].includes("bx_block_share_card/card");
        let isShareAccount = details["redirection_url"].includes("share_account");
        let isPollTypeLink = details["redirection_url"].includes("bx_block_share_poll/poll");
        let isInviteTypeLink = details["redirection_url"].includes("invite");
        let isPostTypeLink = details["redirection_url"].includes("bx_block_posts/post_detail");
        // let isChannelLink = details["redirection_url"].includes("api/v1/channels/cards");
        if (isCardTypeLink) {
          let card_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["card_id"] = card_id

        } else if (isPollTypeLink) {
          let poll_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["poll_id"] = poll_id
        } else if (isPostTypeLink) {
          let post_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
          newDetails["post_id"] = post_id
        }
        // else if (isChannelLink) {
        //   console.log("isChannelLinkisChannelLink", isChannelLink);

        //   let channel_id = details["redirection_url"].substring(details["redirection_url"].lastIndexOf('/') + 1)
        //   // console.log(channel_id, "newDetailsnewDetailsnewDetails", newDetails);

        //   // newDetails["channel_id"] = channel_id
        // }
      }
    }
    this.loadDetails(newDetails, navigationDetails)
  }
  loadDetails = (details: any, navigationDetails: any) => {
    console.log(navigationDetails, "detailsdetails", details);

    if (navigationDetails.type == 'homePage') {
      this.getPost(details?.post ? details?.post : details.post_id)
    }
    else {
      if (navigationDetails.type == 'Post') {
        this.getPost(details.post_id ? details.post_id : details.post)
        // this.props.navigation.setParams({ item: null, details: null })
        if (!navigationDetails.commentId) return
      }
      else if (navigationDetails.type == 'Card' || navigationDetails.type == 'channel_card') {
        console.log("details.channeldetails.channel", details.channel);

        if (details.channel == "true") {
          console.log("details1", details);

          this.getChannelCard(details.card_id ? details.card_id : details.poll_id)
          if (!navigationDetails.commentId) return
        } else {
          console.log("details2", details);
          this.getCard(details.card_id ? details.card_id : details.card)
          // this.props.navigation.setParams({ item: null, details: null })
          if (!navigationDetails.commentId) return
        }
      }
      else if (navigationDetails.type == 'Poll') {
        // this.props.navigation.setParams({ item: null, details: null })
        this.getPoll(details.poll_id ? details.poll_id : details.poll)
        if (!navigationDetails.commentId) return
      }
      else if (navigationDetails.type == 'qaboard') {
        this.getForum(details.qa_board_id)
        // this.props.navigation.setParams({ item: null, details: null })
      }
      else if (navigationDetails.type == 'Forum') {
        this.getForum(navigationDetails.questionId)
        // this.props.navigation.setParams({ item: null, details: null })
        if (!navigationDetails.commentId) return
      }
    }
  }

  handleSendComment = () => {
    if (!this.state.canSendComment || true) {
      if (this.state.commentType == "Forum") {
        this.setState({ isCommentLoading: true })
        this.createQuestion();
      } else {
        this.setState({ isCommentLoading: true })
        this.state.replyId == "" ? this.sendComment() : this.sendReplyComments()
      }
    }
  }

  listOfTimeHorizone = {
    "next_1_month": "Next 1 Month",
    'next_1_to_6_month': "Next 1-6 Months",
    'next_6_to_12_month': "Next 6-12 Months",
    'more_than_1_year': "More than 1 Year"
  }

  handleClickItem = (item: any, onSuggestionPress: any) => {
    let detail = []
    detail = this.state.mentionedId
    detail.push({
      "tag_type": "caption",
      "tagged_type": item.tagged_type,
      "tagged_id": item.id,
    })
    this.state.compareDetails.push({
      "tag_type": "caption",
      "tagged_type": item.tagged_type,
      "tagged_id": item.id,
      'company_symbol': item?.company_symbol,
      'exchange': item?.exchange,
      'company_name': item?.company_name
    })
    this.setState({ mentionedId: detail })
    let normalCommentArray = this.state.normalComment.split(' ')
    let newCommentArray = []
    for (let i = 0; i < normalCommentArray.length; i++) {
      const data = normalCommentArray[i];
      if (!data.includes('@')) {
        newCommentArray.push(data)
      } else {
        newCommentArray.push(item.tagged_type == this.stockCompany ? item.company_name : item.full_name)
      }
    }
    let finalComment = ''
    newCommentArray.forEach(item => {
      finalComment = finalComment + item + ' '
    })
    this.setState({ normalComment: finalComment })
    onSuggestionPress({ id: item.id, name: item.tagged_type == this.stockCompany ? item.company_name : item.full_name })
  }

  setBasicDetails = (data: any) => {
    if (data) {
      this.setState({ card_comments_api: data, isLoading: false, })
      this.getCardCommentsData(data)
      if (this.state.type == 'Poll') {
        this.setState({ commentType: "Poll" })
      }
      else if (data.includes('qa_parent_id')) {
        this.setState({ commentType: 'Forum' })
      } else if (data.includes('cards')) {
        this.setState({ commentType: 'Card' })
      } else if (data.includes('polls')) {
        this.setState({ commentType: 'Poll' })
      } else {
        this.setState({ commentType: 'Post' })
      }
    }
  }
  // Customizable Area Start
  getCardCommentsData = async (cardApi: any) => {
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetAllCardsCommentsCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      cardApi
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
  }

  setViewCommentId = (id: any) => {
    this.setState({ openViewCommentID: id, viewComment_List: [], isHideComments: false, isLoadingReplyComment: true })
    if (this.state.openViewCommentID == id) {
      this.setState({ openViewCommentID: "", viewComment_List: [], isHideComments: true, isLoadingReplyComment: false })
    }
    Keyboard.dismiss()
    this.setState({ isShow: false })
    this.viewReplyCommentes(id)
  }

  goToBack = () => {
    this.setState({ comment: '', isLoading: false, comments_List: [], isShow: false, isCommentLoading: false, isCreator: false, error: '' })
    if (this.state.type == 'channel_card') {

    }
    this.props.navigation.goBack()
    return
  }

  manageOnPress = (url: any, htmlAttribs: any) => {
    let uri = url
    let type
    let finalUriParts
    if (url.startsWith('about:///')) {
      let uriParts = url.split('///')
      finalUriParts = htmlAttribs.split('/')
      if (finalUriParts[0] == this.stockCompany || finalUriParts[0] == this.accountBlock) {
        type = finalUriParts[0]
      } else {
        uri = "https://" + uriParts[1]
      }
    }
    if (type) {
      let id = finalUriParts[finalUriParts?.length - 1]
      this.goToFriendProfilePage(id, type, finalUriParts)
    } else {
      if (validURL(uri)) {
        Linking.openURL(uri)
      } else {
        let id = url.split("/").reverse()[0]
        this.goToFriendProfilePage(id, '', [])
      }
    }
  }

  sendComment = async () => {
    if (this.state.comment !== "") {
      const token = await getStorageData("Token");
      const header = {
        "Content-Type": configJSON.httpApiContentType,
        token: token,
      };
      let companydetails = this.state.compareDetails.filter((data: any) => data.tagged_type == this.stockCompany)
      let normalCaption = replaceMentionValues(this.state.comment, ({ id, name }) => {
        return name
      })
      let caption = replaceMentionValues(this.state.comment, ({ id, name, original }) => {
        let item = companydetails.find((data: any) => data.tagged_id == id)
        if (item) {
          return `<a href="${this.stockCompany}/${item.company_name}/${item.company_symbol}/${item.exchange}/${id}">${name}</a>`
        } else {
          return `<a href="account_block/accounts/${id}">${name}</a>`
        }
      })
      let temp = caption.split(' ')
      let newMessage = ""
      temp.map((item) => {
        if (validURL(item)) {
          newMessage = newMessage + " " + `<a href="${item}">${item}</a>`
        } else {
          newMessage = newMessage + " " + item
        }
      })

      let data = JSON.stringify({
        "data": {
          "attributes": {
            "commentable_id": this.state.cardID,
            "commentable_type": this.state.commentType,
            "comment": newMessage,
            "tags_attributes": this.state.mentionedId,
            "message": normalCaption
          }
        }
      })

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
      this.apiCommentCallId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.postCommentonCard
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        data
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod
      );
      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    } else {
      this.setState({ isCommentLoading: false })
    }
  }

  createQuestion = async () => {
    const token = await getStorageData("Token");
    if (this.state.comment !== "") {
      const header = {
        "Content-Type": configJSON.httpApiContentType,
        token: token,
      };
      let companydetails = this.state.compareDetails.filter((data: any) => data.tagged_type == this.stockCompany)
      let normalCaption = replaceMentionValues(this.state.comment, ({ id, name }) => {
        return name
      })
      let caption = replaceMentionValues(this.state.comment, ({ id, name, original }) => {
        let item = companydetails.find((data: any) => data.tagged_id == id)
        if (item) {
          return `<a href="${this.stockCompany}/${item.company_name}/${item.company_symbol}/${item.exchange}/${id}">${name}</a>`
        } else {
          return `<a href="account_block/accounts/${id}">${name}</a>`
        }
      })
      let temp = caption.split(' ')
      let newMessage = ""
      temp.map((item) => {
        if (validURL(item)) {
          newMessage = newMessage + " " + `<a href="${item}">${item}</a>`
        } else {
          newMessage = newMessage + " " + item
        }
      })
      let data = JSON.stringify({
        "qa_parent_id": this.props.route.params.questionId,
        "description": newMessage,
        "message": normalCaption,
        "tags_attributes": this.state.mentionedId
      })
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
      this.apiCreateAnswerId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.postCreateAnswer
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        data
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod
      );
      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    }
  }

  replyofComment = (item: any) => {
    this.setState({
      replyId: item.id,
      replyItem: item,
      openViewCommentID: item.id
    })
  }

  viewReplyCommentes = async (commentid: any) => {
    Keyboard.dismiss()
    let data = JSON.stringify({
      "comment": {
        "id": commentid
      }
    })
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiViewAllRepliesCommentCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getReplyOfComments
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  deleteComment = async (deleteid: any, account_id: any) => {
    this.setState({ deleteId: deleteid, deleteCommentLoading: true })
    const accountid = await getStorageData("AccountID");
    let endPoint;
    if (accountid == account_id) {
      endPoint = configJSON.deleteCommentCard + deleteid
    } else {
      endPoint = configJSON.delete_other_users_comment_on_own_post + deleteid
    }
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDeleteCommentCallId = requestMessage.messageId;
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
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  deleteCommentForum = (id: any) => {
    this.setState({ deleteCommentLoading: true, deleteId: id })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.token,
    };
    const body = {
      id: id
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDeleteforumComment = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.deleteForum
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
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  sendReplyComments = async () => {
    Keyboard.dismiss()
    if (this.state.comment !== "") {
      const token = await getStorageData("Token");
      const header = {
        "Content-Type": configJSON.httpApiContentType,
        token: token,
      };
      let companydetails = this.state.compareDetails.filter((data: any) => data.tagged_type == this.stockCompany)
      let normalCaption = replaceMentionValues(this.state.comment, ({ id, name }) => {
        return name
      })
      let caption = replaceMentionValues(this.state.comment, ({ id, name, original }) => {
        let item = companydetails.find((data: any) => data.tagged_id == id)
        if (item) {
          return `<a href="${this.stockCompany}/${item.company_name}/${item.company_symbol}/${item.exchange}/${id}">${name}</a>`
        } else {
          return `<a href="account_block/accounts/${id}">${name}</a>`
        }
      })
      let temp = caption.split(' ')
      let newMessage = ""
      temp.map((item) => {
        if (validURL(item)) {
          newMessage = newMessage + " " + `<a href="${item}">${item}</a>`
        } else {
          newMessage = newMessage + " " + item
        }
      })
      let data = JSON.stringify({
        "id": this.state.replyId,
        "comment": {
          "comment": newMessage,
          'tags_attributes': this.state.mentionedId,
          "message": normalCaption
        }
      })
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
      this.apisendReplyCommentCallId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.postReplyComments
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        data
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod

      );
      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    } else {
      this.setState({ isCommentLoading: false })
    }
  }

  hendleTag = (caption: any) => {
    let lastIndex = caption.lastIndexOf("@")
    if (lastIndex != -1) {
      // setTimeout(() => {
      this.setState({ suggestions: [] })
      // }, 10);
      if (!caption.slice(lastIndex).includes(' ')) {
        let data = caption.slice(lastIndex + 1)
        if (data.length >= 1) {
          this.tagPeople(data)
        }
      }
    }
    this.setState({ comment: caption, normalComment: caption })
  }

  removeFromList = (id: any, type: string) => {
    if (type == "card") {
      let temp = this.state.cards;
      let index = temp.findIndex((data: any) => data.id == id);
      if (index != -1) {
        temp.splice(index, 1);
        this.setState({ cards: temp });
      }
    }
  };

  tagPeople = async (text: any) => {
    const token = await getStorageData("Token");
    let endPoint = configJSON.tagUserApiEndPoint
    endPoint = endPoint + text
    const header = {
      "Content-Type": configJSON.createPostApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apitagSearchPeopleCalledId = requestMessage.messageId;
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
  }

  goToFriendProfilePage = async (id: any, type?: string, details?: any) => {
    if (type == this.stockCompany) {
      let header
      let name = details[1].split('%20').join(' ').split("%28").join('(').split("%29").join(')')
      if (details.length == 6) {
        header = {
          name: name,
          symbol: details[2] + '/' + details[3],
          exchange: details[4],
        }
      }
      else if (details.length == 7) {
        header = {
          name: name + '/' + details[2].split('%20').join(' ').split("%28").join('(').split("%29").join(')'),
          symbol: details[3] + '/' + details[4],
          exchange: details[5],
        }
      }
      else {
        header = {
          name: name,
          symbol: details[2],
          exchange: details[3],
          stock_company_id: details[4]
        }
      }
      this.props.navigation.navigate("StockDetail", { header: header })
    }
    else {
      const accountid = await getStorageData("AccountID");
      if (accountid == id) {
        this.props.navigation.navigate("MyTabs", { screen: "Profiles" })
        setEvent("my profile viewed", { "screen": "NotificationPost" })
      } else {
        this.props.navigation.navigate("FriendProfiles", { 'id': id })
      }
    }
  }

  showDelete = (id: any, account_id: any) => {
    this.setState({ visibleModal: true, deleteId: id, deleteAccountId: account_id })
  }

  //Post function
  submitPollAnswer = (type: string, selectedPoll: any, selectedPollItem: any) => {
    this.setState({ submitLoading: true })
    if (type == listOfPollType[0].key) {
      this.PollAns('single', selectedPoll, selectedPollItem)
    } else if (type == listOfPollType[1].key) {
      this.PollAns("compare2", selectedPoll, selectedPollItem)
    } else if (type == listOfPollType[3].key) {
      this.PollAns("custom", selectedPoll, selectedPollItem)
    }
    else {
      this.PollAns("multi", selectedPoll, selectedPollItem)
    }
  }

  markAsComplete = (data: any) => {
    this.setState({ temp: !this.state.temp })
  }

  PollAns = async (type: string, selectedPoll: any, selectedPollItem: any) => {
    let apiData
    if (type == "single") {
      apiData = {
        poll_id: selectedPoll,
        data: {
          vote_for: selectedPollItem
        }
      }
    } else if (type == 'compare2') {
      apiData = {
        poll_id: selectedPoll,
        data: {
          poll_stock_id: selectedPollItem
        }
      }
    }
    else if (type == 'custom') {
      if (!selectedPollItem) {
        return
      }
      apiData = {
        poll_id: selectedPoll,
        data: {
          vote_for: selectedPollItem
        }
      }
    }
    else {
      apiData = {
        poll_id: selectedPoll,
        data: {
          ids_in_sequence: selectedPollItem
        }
      }
    }

    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.createAns = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createAns
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(apiData)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  getForum = (id: any) => {
    this.setState({ type: 'forum' })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetForum = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSingleForum + id
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
  }

  getPost = (id: any) => {
    this.setState({ type: 'post' })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetPost = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSinglePost + id
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
  }

  getPoll = (id: any) => {
    this.setState({ type: 'poll' })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetPoll = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSinglePoll + id
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
  }

  getCard = (id: any) => {
    this.setState({ type: 'card' })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetCard = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSingleCard + id
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
  }

  getChannelCard = (id: any) => {
    this.setState({ type: 'channel_card' })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      Authorization: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiGetChannelCard = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSingleChannelCard + id
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
  }

  // Customizable Area End
}
