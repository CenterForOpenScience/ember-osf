export default {
    pickOne: function(list) {
        return function() {
            return list[Math.floor(Math.random() * list.length)];
        };
    }
};
