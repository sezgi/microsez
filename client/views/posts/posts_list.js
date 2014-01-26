Template.postsList.helpers({
  postsWithRank: function() {
    this.posts.rewind();
    return this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  },
  
  hasMorePosts: function () {
    this.posts.rewind();
    return Router.current().limit() == this.posts.fetch().length;
  },

  randomPost: function () {
    var postId = Session.get('randomPostId');
    if (postId) {
      var post = Posts.find(postId).fetch()[0];
      if (post) {
        post.highlightComment = Comments.find(Session.get('highlightCommentId')).fetch()[0];
        return post;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
});


Template.postsList.rendered = function () {
  if (!this.rendered) {
    var self = this;
    HTTP.call("GET", Router.routes['randomComment'].path(), {}, function (error, response) {
        if (!error) {
          var comment = $.parseJSON(response.content)[0];
          Meteor.subscribe('singlePost', comment.postId);
          Meteor.subscribe('comments', comment.postId);
          Session.set('randomPostId', comment.postId);
          Session.set('highlightCommentId', comment._id);
          self.rendered = true;
        }
    });
  }
};

