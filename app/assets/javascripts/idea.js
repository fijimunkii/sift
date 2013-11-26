var Idea = Backbone.View.extend({
  className: 'idea',

  initialize: function(idea) {
    this.$el.text(idea.content);
    this.render();
  },

  events: {
    'mouseover': 'hoverOn',
    'mouseleave': 'hoverOff'
  },

  hoverOn: function() {
    this.$el.addClass('hover');
  },

  hoverOff: function() {
    this.$el.removeClass('hover');
  },

  render: function() {
    $('#ideas').prepend(this.el);
  }

});
