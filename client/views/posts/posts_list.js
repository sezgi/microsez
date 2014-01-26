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
  }
});


Template.postsList.rendered = function () {
  HTTP.call("GET", Router.routes['randomPost'].path(), {}, function (error, response) {
      if (!error) {
        var post = $.parseJSON(response.content)[0],
            html = $(Template.postPage(post));
        $('.currentPost').append(html);
      }
  });
};

