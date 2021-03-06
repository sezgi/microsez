Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return [Meteor.subscribe('notifications')];
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  limit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    return [
      Meteor.subscribe('posts', this.findOptions())
    ];
  },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions()),
      nextPath: this.nextPath()
    };
  }
});

NewPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
  }
});

BestPostsListController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.limit() + this.increment})
  }
});

Router.map(function() {
  this.route('home', {
    path: '/',
    controller: NewPostsListController
  });
  this.route('newPosts', {
    path: '/new/:postsLimit?',
    controller: NewPostsListController
  });
  this.route('bestPosts', {
    path: '/best/:postsLimit?',
    controller: BestPostsListController
  });
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ]
    },
    data: function () { return Posts.findOne(this.params._id); }
  });
  this.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
  });
  this.route('postSubmit', {
    path: '/submit',
    disableProgress: true
  });
  
  // server routes
  this.route('randomComment', {
    where: 'server',
    path: '/randomComment',
    action: function () {
      var randomNumber = _.random(Comments.find({ votes: { $gte: 0 } }).count() - 1),
          randomComment = Comments.find({ votes: { $gte: 0 } }, { limit: 1, skip: randomNumber }).fetch();
      this.response.writeHead(200, {'Content-Type': 'application/json'});
      this.response.end(JSON.stringify(randomComment));
    }
  })
  this.route('search', {
    where: 'server',
    path: '/search/:query',
    action: function () {
      this.response.writeHead(200, {'Content-Type': 'application/json'});
      this.response.end(JSON.stringify(Posts.find({ 'title' : { $regex: this.params.query, $options: 'i' }}).fetch()));
    }
  });
});

var requireLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
    this.stop();
  }
}

Router.before(requireLogin, {only: 'postSubmit'});

if (Meteor.isClient) {
  Router.before(function() { 
    Errors.clearSeen();
  });
}
