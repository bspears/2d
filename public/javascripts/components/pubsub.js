module.exports = function() {
    var events = {};
    var hasProp = events.hasOwnProperty;

    return {
        sub : function(event, listener) {
            //check if event exists, and add new event to events object if it does not yet exist.
            if(!hasProp.call(events, event)) events[event] = [];

            //push the listener to the new event's array;
            var index = events[event].push(listener) -1;

            //provide handle to remove event
            return {
                remove : function() {
                    delete events[event][index];
                }
            };
        },
        pub :  function(event, info) {
            //check to see if event exists, return if none.
            if(!hasProp.call(events, event)) return;

            //loop through events, fire
            events[event].forEach(function(item) {
                item(info != undefined ? info : {});
            })
        }
    };
}