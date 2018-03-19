var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    priority: '1',
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

    updatePriority: function(item) {
      console.log(item.priority);
      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: item.completed,
        orderChange: false,
      }).then(response => {
        return true;
      }).catch(err => {
      });
    },

    addItem: function() {
      axios.post("/api/items", {
        text: this.text,
        priority: this.priority,
        completed: false
      }).then(response => {
        this.text = "";
        this.priority = "1";
        this.getItems();
        return true;
      }).catch(err => {
      });
    },

    sortTop: function() {
      this.items.sort(function (a,b) {
        if (a.priority > b.priority) {
          return 1;
        }
        return -1
      }).reverse();
      axios.put('/api/sortTop', {
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },

    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: !item.completed,
        orderChange: false,
      }).then(response => {
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
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
        if (item.completed)
          this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
        text: this.drag.text,
        priority: this.drag.priority,
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
