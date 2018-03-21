var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    comment: '',
    image: '',
    drag: {},
  },

  computed:{
    activeItems: function() {
      return this.items.filter(function(item) {
        return !item.completed;
      });
    },

    filteredItems: function() {
      if (this.show === 'active')
        return this.items.filter(function(item) {
          return !item.completed;
        });
      if (this.show === 'completed')
        return this.items.filter(function(item) {
          return item.completed;
        });
      return this.items;
    },
  },

  created: function() {
    this.getItems();
  },

  methods: {

    getItems: function() {
      axios.get("/api/items").then(response => {
        this.items = response.data;
        return true;
      }).catch(err => {
      });
    },

    addItem: function() {
      axios.post("/api/items", {
        text: this.text,
        comment: this.comment,
        image: this.image,
      }).then(response => {
        this.text = "";
        this.comment = "";
        this.image = "";
        this.getItems();
        return true;
      }).catch(err => {
      });
    },

    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },

    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
        text: this.drag.text,
        comment: this.drag.comment,
        image: this.drag.image,
        completed: this.drag.completed,
        orderChange: true,
        orderTarget: item.id
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
  }
});
