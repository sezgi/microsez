Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current().route.name === name
    });

    return active && 'active';
  }
});

Template.header.events({
  'submit .form-search': function (e) {
    e.preventDefault();
  }
});

Template.header.rendered = function () {
  var postsMap = {},
      titles = [];
  $('.search-query').typeahead({
      source: function (query, process) {
        HTTP.call("GET", Router.routes['search'].path({ query: query }), {}, function (error, response) {
          postsMap = {};
          titles = [];
          var posts = $.parseJSON(response.content);

          _.each(posts, function (post) {
            postsMap[post.title] = post._id;
            titles.push(post.title);
          });

          process(titles);
        });
      },
      matcher: function () { return true; },
      updater: function (item) {
        Router.go(Router.routes['postPage'].path({ _id: postsMap[item] }))
        return item;
      }
  });
}
