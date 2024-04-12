Object.defineProperty(exports, "__esModule", {
  value: true
});

// Customizable Area Start
exports.httpGetMethod = "GET";
exports.httpDeleteMethod = "DELETE";
exports.httpPostMethod = "POST"
exports.httpApiContentType = "application/json";

exports.postCommentonCard = "bx_block_comments/comments"
exports.deleteCommentCard = "bx_block_comments/comments/"
exports.getReplyOfComments = "bx_block_comments/comments/comment_replies"
exports.postReplyComments = "bx_block_comments/comments/reply_comment"
exports.delete_other_users_comment_on_own_post = "bx_block_comments/comments/delete_other_users_comment_on_own_post?comment_id="
exports.tagUserApiEndPoint = "bx_block_catalogue/tags/search_tagged_list?filter_param="
exports.postCreateAnswer = "bx_block_qa_boards/qa_boards/create_qa_answer"
exports.getAllAnswer = "bx_block_qa_boards/qa_boards/get_qa_answers?"
exports.deleteForum = "bx_block_qa_boards/qa_boards/delete_qa_answer";

// static text
exports.deleteModalTitle = "Do you want to delete the comment?";
exports.placeholderText = "Write a message ...";
exports.tataMotor = 'Tata Motors Limited';
exports.hideReply = '- Hide Replies';
exports.viewReply = '- View Replies';

// Customizable Area End