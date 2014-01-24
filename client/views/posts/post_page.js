Template.postPage.helpers({
  comments: function() {
    return this.comments || Comments.find({postId: this._id});
  }
});