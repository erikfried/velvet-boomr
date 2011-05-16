/*global BOOMR : true, window */
// w is the window object
(function (w) {
    //It's possible that  plugin is loaded before boomerang, in which case you'll need this.
    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    // A private object to encapsulate implementation details
    var impl = {
        trackers : [],
        baseUrl : "http://www.velvetmetrics.com/log",

        // Resolve the names and values of any parameters in the 't_other' var.
        // Returns them as an object.
        getCustomVars : function (o) {
            var others = [],
                    other = [],
                    result = {};

            if (!o.t_other) {
                return result;
            }
            others = o.t_other.split(',');
            for (var ix in others) {
                other = others[ix].split('|');
                if (other.length !== 2) {
                    BOOMR.warn("other var could not be split into proper name-value: " + others[ix]);
                }
                result[other[0]] = other[1];
            }
            return result;

        },
        resolveVal : function (tracker, o, other_vars) {
            var value;
            if (tracker.val && typeof tracker.val === 'string') {
                value = (o[tracker.val] ? o[tracker.val] : other_vars[tracker.val]);
            } else if (tracker.val && typeof tracker.val === 'function') {
                value = tracker.val(o, other_vars);
            } else {
                BOOMR.warn("Config for tracker " + tracker.path + " is incomplete. 'resolver' is " + tracker.val);
            }
            return value;
        },
        // The 'main' method.
        // Performs transformation of parameters from standard boomerang form to fitting the velvet metric api and
        // slices up the standard single beacon request into one request per metric and
        run : function (o) {
            var tracker = null,
                value = null,
                custom_vars = impl.getCustomVars(o);

            for (var ix in impl.trackers) {
                tracker = impl.trackers[ix];
                value = impl.resolveVal(tracker, o, custom_vars);
                if (value) {
                    var vmbeacon = new Image();
                    vmbeacon.src = impl.baseUrl + "?path=" + tracker.path + "&power=" + value + "&output=image";
                } else {
                    BOOMR.warn("Could not resolve value for tracker " + tracker.path + ' via ' + tracker.val + ' in ' + o);
                }

                value = null;
            }

        }
    };

    BOOMR.plugins.VM = {
        init: function (config) {
            var properties = ["baseUrl", "trackers"];
            BOOMR.utils.pluginConfig(impl, config, "VM", properties);

            //Intercept action before beacon is requested and transform query parameters
            //to something meaningful for our beacon service api.
            BOOMR.subscribe('before_beacon', impl.run);

            return this;
        },

        //Always return true, this plugin does nothing before the 'before_beacon' event. Thus it´s always ready/complete
        is_complete: function () {
            return true;
        }
    };

}(window));