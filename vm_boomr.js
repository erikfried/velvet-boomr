/*global BOOMR : true, window */
// w is the window object
(function (w) {   
// First make sure BOOMR is actually defined.  It's possible that  plugin is loaded before boomerang, in which case
// you'll need this.
    BOOMR = BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

        // A private object to encapsulate implementation details
    var d = w.document,
        impl = {
            //properties
            cfgs : [],
            trackers : null,
            allFired : false,
            //methods
            createTrackers : function (o) {
                var i = 0,
                    len = this.cfgs.length,
                    cfg,
                    tracker;
                this.trackers = [];
                for (i; i < len; i += 1) {
                    cfg = this.cfgs[i];
                    tracker = { path : cfg.path };
                    tracker.value = o[cfg.boomr_pname];
                    if (tracker.value) {
                        this.trackers.push(tracker);
                    } else {
                        BOOMR.warn("There was no param " + cfg.boomr_pname + ' in ' + o);
                    }
                }
            },
            removeAllParams : function (o) {
                var k;
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        BOOMR.removeVar(k);
                    }
                }
            },
            //Add meaningful params for the velvetmetrics beacon server api.
            addTrackerParams : function (tracker) {
                console.log('adding '+ tracker.path + tracker.value);
                BOOMR.addVar("path", tracker.path);
                BOOMR.addVar("power", tracker.value);
                BOOMR.addVar("output", "image");
            }
        };

    BOOMR.plugins.VM = {

        init: function (config) {
            var properties = ["cfgs"];
            // This block is only needed if you actually have user configurable properties (coming up...)
            BOOMR.utils.pluginConfig(impl, config, "VM", properties);

            //Intercept action before beacon is requested and transform query parameters
            //to something meaningful for our beacon service api.
            //For this test we are only measuring page roundtripTime
            BOOMR.subscribe('before_beacon', function (o) {
                var currentTracker,
                    nextTracker;
                if (impl.trackers === null) {
                    impl.createTrackers(o);
                    impl.removeAllParams(o); //Remove all params that would otherwise show up in beacon url for no good.
                }
                if (impl.allFired) {
                    BOOMR.info("All trackers have been fired. Removing all vars");
                    impl.removeAllParams(o);
                    return;
                }

                currentTracker = impl.trackers.pop();

                if (currentTracker) {
                   impl.addTrackerParams(currentTracker);

                }
                nextTracker = impl.trackers.pop();
                if (nextTracker) {
                    var deferredBeaconCall = function (tracker) {
                        return function (){
                            console.log('' +tracker.path);
                            impl.removeAllParams(o); //Remove all params that would otherwise show up in beacon url for no good.
                            impl.addTrackerParams(tracker);
                            BOOMR.sendBeacon();
                        }
                    }
                    w.setTimeout(deferredBeaconCall(nextTracker), 0);
                } else {
                    impl.allFired = true
                }
            });

            return this;
        },

        //Always return true, because this plugin does nothing before the 'before_beacon' event and thus it´s always ready/complete
        is_complete: function () {
            return true;
        }
    };

}(window));