var Value = require('basis.data').Value;
var Node = require('basis.ui').Node;
var tabs = require('basis.ui.tabs');
var Entity = basis.require('basis.entity');
var Service = basis.require('basis.net.service').Service;

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

// define data types
var ContentItem = Entity.createType('ContentItem', {
  name: String
});

var LessonContent = Entity.createType('LessonContent', {
  theory: Entity.createSetType(ContentItem),
  practice: Entity.createSetType(ContentItem)
});

var Lesson = Entity.createType('Lesson', {
  title: String,
  content: Entity.createSetType(LessonContent),
  dateTime: Date
});

// load data
Lesson.all.setSyncAction(service.createAction({
  url: '/src/app/data/lessons.json',
  method: 'GET',
  success: function(data) {
    this.setAndDestroyRemoved(Lesson.readList(data));
  }
}));

new tabs.AccordionControl({
  container: document.body,
  dataSource: Lesson.all,
  childClass: {
    dataSource: 'data.content',
    binding: {
      title: 'data:'
    },
    childClass: {
      autoDelegate: true,
      template: resource('./app/template/lesson-tab-content.tmpl'),
      binding: {
        theory: 'satellite:',
        practice: 'satellite:'
      },
      satellite: {
        theory: {
          // instance: ?,
          config: function(owner) {
            return {
              dataSource: Value.from(owner, 'data.theory')
            }
          }
        },
        practice: {
          // instance: ?,
          config: function(owner) {
            return {
              dataSource: Value.from(owner, 'data.practice')
            }
          }
        }
      }
    }
  }
});

// Nodes for list
var lessonContentPart = Node.subclass({
  childClass: {
    template: resource('./app/template/lesson-item.tmpl'),
    binding: {
      name: 'data:'
    }
  }
});

var lessonContent = Node.subclass({
  childClass: lessonContentPart
});

var lessonNode = Node.subclass({
  container: document.body,
  template: resource('./app/template/lesson.tmpl'),
  binding: {
    id: 'data:',
    title: 'data:',
    content: 'satellite:'
  },
  satellite: {
    content: {
      instance: lessonContent,
      config: function(owner) {
        console.dir(owner)
        return {
          dataSource: Value.from(owner, 'data.content')
        }
      },
      binding: {
        theory: 'satellite:',
        practice: 'satellite:'
      },
      satellite: {
        theory: {
          instance: lessonContentPart,
          config: function(owner) {
            return {
              dataSource: Value.from(owner, 'data')
            }
          }
        },
        practice: {
          instance: lessonContentPart,
          config: function(owner) {
            return {
              dataSource: Value.from(owner, 'data')
            }
          }
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
