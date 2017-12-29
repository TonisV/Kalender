$(document).ready(function() {


    /* initialize the external events
     -----------------------------------------------------------------*/
    function init_events(ele) {
        ele.each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            let eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

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

        //Get events from feed
        events : '/calendar/events',
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function(date, allDay) {

            // retrieve the dropped element's stored Event Object
            let originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            let copiedEventObject = $.extend({}, originalEventObject);
            console.log(copiedEventObject);

            // assign it the date that was reported
            copiedEventObject.start           = date;
            copiedEventObject.allDay          = allDay;
            copiedEventObject.backgroundColor = $(this).css('background-color');

            saveEvent(copiedEventObject);

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
            // Remove the element from the "Draggable Events" list
            $(this).remove();

        }
    });

    /* ADDING EVENTS */
    let currColor = '#3c8dbc';//Blue by default
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
        let val = $('#new-event').val();
        if (val.length == 0) {
            return
        }

        //Create events
        let event = $('<div />');
        event.css({
            'background-color': currColor
        }).addClass('fc-event btn mb-1');
        event.html(val);
        $('#external-events').prepend(event);

        //Add draggable funtionality
        init_events(event);

        //Remove event from text input
        $('#new-event').val('');
    });

    function saveEvent(event){
        $.post(
            'calendar/add',
            {
                title   : event.title,
                start   : event.start.toISOString(),
                bgColor : event.backgroundColor
            }
        );
    }

    function updateEvent() {

    }

    function deleteEvent() {

    }


});