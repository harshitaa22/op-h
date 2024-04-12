// Customizable Area Start
import { BackHandler, Keyboard, Linking, StatusBar } from "react-native";
// framework
import { IBlock } from "../../../../../framework/src/IBlock";
import { Message } from "../../../../../framework/src/Message";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { deviceWidth, getStorageData } from "../../../../../framework/src/Utilities";
//library
import { replaceMentionValues } from "react-native-controlled-mentions";
//@ts-ignore
import { AuthContext } from '../../../../../mobile/Navigation/context';
//components
import { validURL, handleTaggedUser, setEvent } from "../../../../../components/src/Utils/service";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  route: {
    params: {
      id: string
      questionId: number
      commentId: number
      parentId: number
      type: string,
      data: any,
      showMenu: any,
      canSendComment: any,
      setCommentCount: (id: string, length: number) => void
    }
  };
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  card_comments_api: string;
  comment: string;
  cardID: string;
  openViewCommentID: string;
  replyId: string;
  commentType: string;
  accountid: string;
  type: string;
  token: string;
  normalComment: string;
  error: string;

  isLoading: boolean;
  isShow: boolean;
  isHideComments: boolean;
  scrolled: boolean;
  refreshing: boolean;
  isCommentLoading: boolean;
  sendCommentPress: boolean;
  heighLight: boolean;
  temp: boolean;
  visibleModal: boolean;
  deleteCommentLoading: boolean;
  isLoadingReplyComment: boolean;
  isCreator: boolean;
  canSendComment: boolean;

  comments_List: any;
  viewComment_List: any;
  replyItem: any;
  suggestions: any;
  keyboardHeight: any;
  mentionedId: any;
  compareDetails: any;
  deleteId: any;
  width: any;
  deleteAccountId: any;
  parentId: any;
  // Customizable Area End
}
interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class ViewAllCommentsController extends BlockComponent<Props, S, SS> {
  // ref: any = null
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
  listRef: any
  commentRef: any
  stockCompany: string = 'StockCompany'
  accountBlock: string = 'account_block'
  backHandler: any
  innerCommentRef: any
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage)
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      replyItem: {},

      keyboardHeight: 0,

      suggestions: [],
      mentionedId: [],
      compareDetails: [],
      comments_List: [],
      viewComment_List: [],

      type: '',
      deleteId: '',
      width: '99.9%',
      accountid: '',
      token: '',
      card_comments_api: '',
      commentType: '',
      deleteAccountId: '',
      normalComment: '',
      error: '',
      replyId: '',
      openViewCommentID: '',
      cardID: '',
      comment: '',

      isShow: false,
      isHideComments: true,
      scrolled: false,
      refreshing: false,
      sendCommentPress: false,
      heighLight: false,
      temp: false,
      visibleModal: false,
      deleteCommentLoading: false,
      parentId: null,
      isLoadingReplyComment: false,
      isCreator: false,
      canSendComment: false,
      isLoading: true,
      isCommentLoading: false,
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
        if (apiRequestCallId === this.apiGetAllCardsCommentsCallId) {
          if (this.state.commentType == "Forum") {
            if (responseJson.errors) {
              this.setState({ isLoading: false, comments_List: [], })
              return
            }
            this.setState({ comments_List: responseJson.data.reverse(), heighLight: true })
            setTimeout(() => {
              this.setState({ heighLight: false })
            }, 2000);
          } else {
            responseJson?.new_comments?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            if (this.state.parentId) {
              let index = responseJson?.new_comments?.findIndex((data: any) => data.id == this.state.parentId) || -1
              if (index != -1) {
                this.setState({ openViewCommentID: this.state.parentId, isHideComments: false })
                this.viewReplyCommentes(this.state.parentId)
              }
            }
            else {
              let index = responseJson?.new_comments?.findIndex((data: any) => data.id == this.props?.route?.params?.commentId) || -1
              if (index != -1) {
                this.setState({ heighLight: true })
                setTimeout(() => {
                  this.listRef && this.listRef.scrollToIndex({ index: index, animated: true })
                }, 100);
                setTimeout(() => {
                  this.props.navigation.setParams({ commentId: null })
                  this.setState({ heighLight: false })
                }, 2000);
              }
            }
            this.setState({ comments_List: responseJson?.new_comments || [], cardID: responseJson.id })
          }
          if (responseJson?.new_comments?.length == 0) {
            this.setState({ error: 'No comment available!' })
          }
          this.setState({ isLoading: false, })
        }
        // post commnet
        if (apiRequestCallId === this.apiCommentCallId) {
          this.setState({ comment: "" })
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
              let index = responseJson.data.findIndex((data: any) => data.id == this.props?.route?.params?.commentId)
              if (index != -1) {
                this.setState({ heighLight: true })
                setTimeout(() => {
                  this.listRef && this.listRef.scrollToIndex({ index: mainIndex, animated: true })
                  // this.innerCommentRef && this.innerCommentRef.scrollToIndex({ index: index, animated: true })
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
          this.setState({ suggestions: responseJson })
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
      }
    }
  }

  // Customizable Area End
  componentDidMount = async () => {
    setTimeout(() => {
      this.setState({ width: deviceWidth - 140 })
    }, 0);
    this.setBasicDetails()
    const accountid = await getStorageData("AccountID");
    const token = await getStorageData('Token')
    this.setState({ accountid: accountid, type: this.props.route.params.type, scrolled: false, isLoading: true, token: token, })
    // this.backHandler =  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.props.navigation.addListener('focus', () => {
      this.setBasicDetails()
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    })
    this.props.navigation.addListener('blur', () => {
      // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      this.backHandler?.remove()
    })
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

  handleBackButtonClick = () => {
    let { setCommentCount, id } = this.props?.route?.params
    if (!this.state.isLoading) {
      setCommentCount(id, this.state.comments_List.length)
    }
    this.setState({ comment: '', isLoading: true, comments_List: [], isShow: false, isCommentLoading: false, isCreator: false, error: '' })
    this.props.navigation.goBack()
    return true
  }

  handleClickItem = (item: any, onSuggestionPress: any) => {
    let detail = []
    detail = this.state.mentionedId
    let index = detail?.findIndex((items: any) => items?.tagged_id == item?.id);
    if (index === -1) {
      detail.push({
        "tag_type": "caption",
        "tagged_type": item.tagged_type,
        "tagged_id": item.id,
      })
    }
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

  setBasicDetails = () => {
    let { data, type, parentId, showMenu, canSendComment } = this.props.route.params
    this.setState({ type: type, parentId: parentId, isCreator: showMenu, canSendComment, isLoading: true })
    if (data) {
      this.setState({ card_comments_api: data, isLoading: true, })
      this.getCardCommentsData(data)
      if (type == 'Poll') {
        this.setState({ commentType: "Poll" })
      }
      else if (data.includes('qa_parent_id')) {
        this.setState({ commentType: 'Forum' })
      } else if (data.includes('cards')) {
        this.setState({ commentType: 'Card' })
      }
      else if (type == 'Poll') {
        this.setState({ commentType: "Poll" })
      }
      else {
        this.setState({ commentType: 'Post' })
      }
    }
  }

  getCardCommentsData = async (cardApi: any) => {
    console.log("cardApicardApi", cardApi);

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
    let { setCommentCount, id } = this.props.route.params
    if (!this.state.isLoading) {
      setCommentCount(id, this.state.comments_List?.length || 0)
    }
    this.setState({ comment: '', isLoading: true, comments_List: [], isShow: false, isCommentLoading: false, isCreator: false, error: '' })
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
      console.log('uriParts', finalUriParts);
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
    console.log("sendCommentsendComment");

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
            "tags_attributes": handleTaggedUser(this.state.mentionedId, this.state.comment),
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
      if (requestMessage) {
        this.setState({ comment: "" })
      }
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
        "tags_attributes": handleTaggedUser(this.state.mentionedId, this.state.comment),
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
          'tags_attributes': handleTaggedUser(this.state.mentionedId, this.state.comment),
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
      this.setState({ suggestions: [] })
      let data = caption.slice(lastIndex + 1)
      if (data.length >= 1) {
        this.tagPeople(data)
      }
    }
    this.setState({ comment: caption, normalComment: caption })
  }

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
        setEvent("my profile viewed", { "screen": "viewAllComments" })
      } else {
        this.props.navigation.navigate("FriendProfiles", { 'id': id })
      }
    }
  }

  showDelete = (id: any, account_id: any) => {
    this.setState({ visibleModal: true, deleteId: id, deleteAccountId: account_id })
  }
  // Customizable Area End
}
