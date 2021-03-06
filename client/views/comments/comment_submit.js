Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var comment = {
      body: $body.val(),
      postId: template.data._id
    };

    Meteor.call('comment', comment, function(error, commentId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
        if (Session.get('highlightCommentId')) {
          Session.set('highlightCommentId', commentId);
        }
        setTimeout(function() {
          $('.comment').addClass('animated fadeInUp');
        }, 0);
      }
    });
  }
});
