Template.postItem.events({
  'click .upvotable': function (e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});

Template.comment.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  },

  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});
