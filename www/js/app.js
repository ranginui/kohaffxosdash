
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');

    // Write your app here.


    function formatDate(d) {
        return (    d.getDate() + '/' +
	d.getMonth()+1) + '/' +        
            d.getFullYear();
    }

    // List view

    var list = $('.list').get(0);    
    var quote;
	
    var request = new XMLHttpRequest();
    request.open('GET', 'http://dashboard.koha-community.org/rq', false);
    request.send(); // because of "false" above, will block until the request is done
                    // and status is available. Not recommended, however it works for simple cases.

    if (request.status === 200) {
      quote = request.responseText;
    }

    var bugs;
    
    request.close
    request.open('GET', 'http://dashboard.koha-community.org/bug_status', false);
    request.send();
    if (request.status === 200) {
          bugs = request.responseText;
	      }
     var signoff;
    request.close
    request.open('GET', 'http://dashboard.koha-community.org/needsignoff', false);
    request.send();
    if (request.status === 200) {
          signoff = request.responseText;
	      }
    
    
    list.add({ title: 'Random Quote',
               desc: quote,
               date: new Date() });
    list.add({ title: 'Bug statuses',
               desc: bugs,
	       date: new Date() });
    list.add({ title: 'Needing signoff',
               desc: signoff,
	       date: new Date() });
	       
    

    // Detail view

    var detail = $('.detail').get(0);
    detail.render = function(item) {
        $('.title', this).html(item.get('title'));
        $('.desc', this).html(item.get('desc'));
        $('.date', this).text(formatDate(item.get('date')));
    };

    // Edit view

    var edit = $('.edit').get(0);
    edit.render = function(item) {
        item = item || { id: '', get: function() { return ''; } };

        $('input[name=id]', this).val(item.id);
        $('input[name=title]', this).val(item.get('title'));
        $('input[name=desc]', this).val(item.get('desc'));
    };

    edit.getTitle = function() {
        var model = this.view.model;

        if(model) {
            return model.get('title');
        }
        else {
            return 'New';
        }
    };

    $('button.add', edit).click(function() {
        var el = $(edit);
        var title = el.find('input[name=title]');
        var desc = el.find('input[name=desc]');
        var model = edit.model;

        if(model) {
            model.set({ title: title.val(), desc: desc.val() });
        }
        else {
            list.add({ title: title.val(),
                       desc: desc.val(),
                       date: new Date() });
        }

        edit.close();
    });
});