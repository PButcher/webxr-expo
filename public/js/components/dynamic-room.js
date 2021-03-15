AFRAME.registerComponent("dynamic-room", {
  init: function () {
    const room = AFRAME.utils.getUrlParameter("room");

    if (!room) {
      window.alert("No room ID supplied: ?room=roomid");
    }

    this.el.setAttribute("networked-scene", {
      room,
      adapter: "socketio",
    });
  },
});
