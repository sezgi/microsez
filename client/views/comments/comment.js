Template.comment.events({
  'click .upvotable': function (e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },

  'click .disabled': function (e) {
    e.preventDefault();
  }
});

Template.comment.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  },

  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId) && (this.userId != userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});
