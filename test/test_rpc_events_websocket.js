/* This file is for testing an event.
 */

var util = require('../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    localServ = require("./server_local/server");
    edbModule = require("../index");
} else {
    asrt = assert;
    edbModule = edbFact;
}

var serverServerURL = "http://localhost:1337/server";

var test_data = require('./testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 30
};

var edb;
var eventSub;

describe('TheloniousHttp', function () {

    before(function (done) {
        this.timeout(4000);

        util.getNewErisServer(serverServerURL, requestData, function(err, URL){
            if(err){
                throw new Error(err);
            }
            edb = edbModule.createInstance(URL + '/socketrpc', true);
            edb.start(function(err){
                if (err){
                    throw new Error(err);
                }
                done();
            });

        })
    });

    describe('.events', function () {

        describe('#subNewBlock', function () {
            it("should subscribe to new block events", function (done) {
                this.timeout(25000);
                console.log("This should take about 15 seconds.");
                edb.events().subNewBlocks(function (err, data) {
                    asrt.ifError(err, "New block subscription error.");
                    eventSub = data;
                    setTimeout(function () {
                        data.stop(function () {
                            throw new Error("No data came in.");
                        })
                    }, 20000);

                }, function(err, data){
                    if(data){
                        eventSub.stop(function(){});
                        done();
                    }
                });
            });
        });

    });
});