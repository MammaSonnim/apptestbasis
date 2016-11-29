var Value = require('basis.data').Value;
var Node = require('basis.ui').Node;
var tabs = require('basis.ui.tabs');
var Entity = require('basis.entity');
var Service = require('basis.net.service').Service;


module.exports = require('basis.app').create({
  title: 'Продвинутый курс по JS',

  init: function(){
    return new Node({
      template: resource('./app/template/layout.tmpl')
    });
  }
});

// create service to load data
var service = new Service();

// define data type
var LessonItem = Entity.createType('LessonItem', {
  name: String
});

// define data type
var Lesson = Entity.createType('Lesson', {
  id: Entity.IntId,
  title: String,
  theory: Entity.createSetType(LessonItem),
  practice: Entity.createSetType(LessonItem)
});

Lesson.all.setSyncAction(service.createAction({
  url: '/src/app/data/lessons.json',
  method: 'GET',
  success: function(data) {
    this.setAndDestroyRemoved(Lesson.readList(data));
  }
}));


// Nodes for list
var LessonItemNode = Node.subclass({
  childClass: {
    template: resource('./app/template/lesson-item.tmpl'),
    binding: {
      name: 'data:'
    }
  }
});

var lessonNode = Node.subclass({
  container: document.body,
  template: resource('./app/template/lesson.tmpl'),
  binding: {
    id: 'data:',
    title: 'data:',
    theory: 'satellite:',
    practice: 'satellite:'
  },
  satellite: {
    theory: {
      instance: LessonItemNode,
      config: function(owner) {
        return {
          dataSource: Value.from(owner, 'data.theory')
        }
      }
    },
    practice: {
      instance: LessonItemNode,
      config: function(owner) {
        return {
          dataSource: Value.from(owner, 'data.practice')
        }
      }
    }
  }
});

var lessonsList = new Node({
  container: document.body,
  dataSource: Lesson.all,
  active: true,
  template: resource('./app/template/lesson-list.tmpl'),
  childClass: lessonNode
});
