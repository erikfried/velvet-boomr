/*global BOOMR : true, window */
// w is the window object
(function (w) {   
    //It's possible that  plugin is loaded before boomerang, in which case you'll need this.
    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    // A private object to encapsulate implementation details
    var d = w.document,
        impl = {
            // ===
            // properties
            trackers : [],
            trackers_left : 0,

            // ===
            // helper methods
            getNext : function () {
                var trackers = impl.trackers;
                return trackers[trackers.length - impl.trackers_left];
            },
            // Resolve the names and values of any parameters in the 't_other' var.
            // Returns them as an object.
            getOtherVars : function (o) {
                var others = [],
                    n_other = 0,
                    other = [],
                    result = {};

                if (!o.t_other) {
                    return result;
                }
                others = o.t_other.split(',');
                n_other =  others.length;
                for (n_other; n_other; n_other -= 1) {
                    other = others[n_other - 1].split('|');
                    if (other.length !== 2) {
                        BOOMR.warn("other var could not be split into proper name-value: " + others[n_other - 1]);
                    }
                    result[other[0]] = other[1];
                }
                return result;

            },
            //
            setTrackerValues : function (o) {
                var i = 0,
                    tracker,
                    other_vars = impl.getOtherVars(o);

                for (i; i < impl.trackers.length; i += 1) {
                    tracker = impl.trackers[i];
                    if (tracker.resolver && typeof tracker.resolver === 'function') {
                        tracker.value = tracker.resolver(o, other_vars);
                    } else if (tracker.resolver && typeof tracker.resolver === 'string') {
                        tracker.value = (o[tracker.resolver] ? o[tracker.resolver] : other_vars[tracker.resolver]);
                    } else {
                        BOOMR.warn("Config for tracker " +  tracker.path + " is incomplete. 'resolver' is " + tracker.resolver);
                    }

                    if (!tracker.value) {
                        BOOMR.warn("Could not resolve value for tracker " + tracker.path + ' via ' + tracker.resolver + ' in ' + o);
                    }
                }
            },
            removeAllVars : function (o) {
                var k;
                BOOMR.debug("Removing all vars");
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        BOOMR.removeVar(k);
                    }
                }
            },
            //Add meaningful params for the velvetmetrics beacon server api.
            addTrackerParams : function (tracker) {
                BOOMR.addVar("path", tracker.path);
                BOOMR.addVar("power", tracker.value);
                BOOMR.addVar("output", "image");
            },
            //The 'main' method.
            // Performs transformation of parameters from standard boomerang form to fitting the velvet metric api and
            // slices up the standard single beacon request into one request per metric and

            transformAndSlice : function (o) {
                var currentTracker;

                // if this is the first call, populate all trackers with values
                if (impl.trackers_left === impl.trackers.length) {
                    impl.setTrackerValues(o);
                }
                impl.removeAllVars(o); //Make sure no vars are left, that would otherwise show up in beacon url for no good.

                if (!impl.trackers_left) { //This can happen becaus of a boomerang bug (https://github.com/yahoo/boomerang/issues/#issue/11)
                    BOOMR.info("All trackers have been fired. Aborting this beacon request");
                    return;
                }

                currentTracker = impl.getNext();
                BOOMR.debug("Preparing for tracker: " + currentTracker.path + ' (value = ' + currentTracker.value + ')');
                if (currentTracker) {
                    //just add params if there is actually a value
                    if (currentTracker.value) {
                        impl.addTrackerParams(currentTracker);
                    }
                    impl.trackers_left -= 1;
                }
                if (impl.trackers_left) {
                    //If there is a next tracker. Put a beacon call for this next tracker on queue.
                    w.setTimeout(BOOMR.sendBeacon, 0);
                }
            }
        };

    BOOMR.plugins.VM = {
        init: function (config) {
            var properties = ["trackers"];
            BOOMR.utils.pluginConfig(impl, config, "VM", properties);

            impl.trackers_left = impl.trackers.length;

            //Intercept action before beacon is requested and transform query parameters
            //to something meaningful for our beacon service api.
            BOOMR.subscribe('before_beacon', impl.transformAndSlice);

            return this;
        },

        //Always return true, this plugin does nothing before the 'before_beacon' event. Thus it´s always ready/complete
        is_complete: function () {
            return true;
        }
    };

}(window));