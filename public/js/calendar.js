//Date for the calendar events (dummy data)
var date = new Date();
var d    = date.getDate(),
    m    = date.getMonth(),
    y    = date.getFullYear();

$(document).ready(function() {


    /* initialize the external events
     -----------------------------------------------------------------*/
    function init_events(ele) {
        ele.each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            }

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject)

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex        : 999,
                revert        : true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            })

        });
    }
    init_events($('#external-events .fc-event'));


    /* initialize the calendar
     -----------------------------------------------------------------*/
    $('#calendar').fullCalendar({
        timezone : 'local',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        //Random default events
        events    : [
            {
                title          : 'ABD OÜ kohtumine',
                start          : new Date(y, m, 1),
                backgroundColor: '#f56954', //red
                borderColor    : '#f56954' //red
            },
            {
                title          : 'Too poest naelu',
                start          : new Date(y, m, d - 5),
                end            : new Date(y, m, d - 2),
                backgroundColor: '#f39c12', //yellow
                borderColor    : '#f39c12' //yellow
            },
            {
                title          : 'Kohtumine Kati',
                start          : new Date(y, m, d, 10, 30),
                allDay         : false,
                backgroundColor: '#0073b7', //Blue
                borderColor    : '#0073b7' //Blue
            },
            {
                title          : 'Lõuna Jüri',
                start          : new Date(y, m, d, 12, 0),
                end            : new Date(y, m, d, 14, 0),
                allDay         : false,
                backgroundColor: '#00c0ef', //Info (aqua)
                borderColor    : '#00c0ef' //Info (aqua)
            },
            {
                title          : 'Koristus',
                start          : new Date(y, m, d + 1, 19, 0),
                end            : new Date(y, m, d + 1, 22, 30),
                allDay         : false,
                backgroundColor: '#00a65a', //Success (green)
                borderColor    : '#00a65a' //Success (green)
            },
            {
                title          : 'Maksa arve',
                start          : new Date(y, m, 28),
                end            : new Date(y, m, 29),
                url            : 'http://google.com/',
                backgroundColor: '#3c8dbc', //Primary (light-blue)
                borderColor    : '#3c8dbc' //Primary (light-blue)
            }
        ],
        /*
        eventClick: function(event, element) {

            event.title = "CLICKED!";

            $('#calendar').fullCalendar('updateEvent', event);

        },*/
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function(date, allDay) {

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject')

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject)

            // assign it the date that was reported
            copiedEventObject.start           = date
            copiedEventObject.allDay          = allDay
            copiedEventObject.backgroundColor = $(this).css('background-color')
            copiedEventObject.borderColor     = $(this).css('border-color')

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true)
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
        }
    });

    /* ADDING EVENTS */
    var currColor = '#3c8dbc';//Red by default
    $('#color-chooser > li > a').click(function (e) {
        e.preventDefault();
        //Save color
        currColor = $(this).css('color');
        //Add color effect to button
        $('#add-new-event').css({ 'background-color': currColor, 'border-color': currColor });
    });

    $('#add-new-event').click(function (e) {
        e.preventDefault();
        //Get value and make sure it is not null
        var val = $('#new-event').val();
        if (val.length == 0) {
            return
        }

        //Create events
        var event = $('<div />');
        event.css({
            'background-color': currColor
        }).addClass('fc-event btn mb-1');
        event.html(val);
        $('#external-events').prepend(event);

        //Add draggable funtionality
        init_events(event);

        //Remove event from text input
        $('#new-event').val('')
    });


});