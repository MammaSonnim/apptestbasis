var Value = require('basis.data').Value;
var Node = require('basis.ui').Node;
var tabs = require('basis.ui.tabs');
var Entity = basis.require('basis.entity');
var Service = basis.require('basis.net.service').Service;
var STATE = basis.require('basis.data').STATE;

// create service to load data
var service = new Service();

var Foobar = Entity.createType('Foobar', {
    title: String,
    content: String
});

// load data
Foobar.all.setSyncAction(service.createAction({
    url: '/src/app/data/foobar.json',
    method: 'GET',
    success: function(data) {
        this.setAndDestroyRemoved(Foobar.readList(data));
    }
}));

Foobar.all.syncAction();

new tabs.AccordionControl({
    container: document.body,
    dataSource: Foobar.all,
    childClass: { // Every Tab
        binding: {
            title: 'data:',
            content: 'data:'
        },
        childClass: {
            template: '<div b:show="{visible}">{content}</div>'
        }
    }
});

