/*global BOOMR : true */
(function () {
    //It's possible that  plugin is loaded before boomerang, in which case you'll need this.
    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    // A private object to encapsulate implementation details
    var impl = {
        trackers : [],
        baseUrl : "http://www.velvetmetrics.com/log",

        // Resolve the names and values of any parameters in 'o.t_other'.
        // Returns them as an object.
        getCustomVars : function (o) {
            var others = [],
                other = [],
                result = {},
                ix = 0,
                n_others = 0;

            if (o.t_other) {
                others = o.t_other.split(',');
                for (ix = 0, n_others = others.length; ix < n_others; ix += 1) {
                    other = others[ix].split('|');
                    if (other.length !== 2) {
                        BOOMR.warn("other var could not be split into proper name-value: " + others[ix]);
                    }
                    result[other[0]] = other[1];
                }
            }
            //redefine this function. The "result" does only have to be calculated once.
            impl.getCustomVars = function () {
                return result;
            };
            return result;

        },
        resolveVal : function (tracker, o) {
            var value = 0,
                other_vars = impl.getCustomVars(o);

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
        run : function (o) {
            var tracker = null,
                value = null,
                ix = 0,
                n_trackers = impl.trackers.length,
                vmbeacon = null;

            for (; ix < n_trackers; ix += 1) {
                tracker = impl.trackers[ix];
                value = impl.resolveVal(tracker, o);
                if (value) {
                    vmbeacon = new Image();
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

            //Intercept action before beacon is requested and transform boomerang default parameters
            //to something meaningful for our beacon service api.
            BOOMR.subscribe('before_beacon', impl.run);

            return this;
        },

        //Always return true, this plugin does nothing before the 'before_beacon' event. Thus it´s always ready/complete
        is_complete: function () {
            return true;
        }
    };
}());