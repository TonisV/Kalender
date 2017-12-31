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

            // assign it the date that was reported
            copiedEventObject.start           = date;
            copiedEventObject.allDay          = allDay;
            copiedEventObject.backgroundColor = $(this).css('background-color');
            // Save event to db
            addEvent(copiedEventObject);
            // Fetch all events because we need db id's for every event
            $('#calendar').fullCalendar('refetchEvents');
            // Remove the element from the "Draggable Events" list
            $(this).remove();
        },
        eventDrop: function(event) {
            updateEvent(event);// After event drop update event data
        },
        eventResize: function(event) {
            updateEvent(event);// After event resize update event data
        },
        eventClick: function(calEvent) {
            // Open event change modal
            $('#change-event-modal').modal('show');
            // Change modal header same as event background
            $('#change-event-color').css('background-color',calEvent.backgroundColor);
            // Color chooser
            $('#change-color-chooser > li > a').click(function (e) {
                e.preventDefault();
                //Save picked color
                let currColor = $(this).css('color');
                //Add color effect to modal header
                $('#change-event-color').css({ 'background-color': currColor });
            });
            // Change event description same as event title
            $('#change-event-desc').val(calEvent.title);

            let $saveBtn = $('#save');
            $saveBtn.unbind();// Remove a previously-attached event handler from the elements
            // Save event data after clicking save button
            $saveBtn.click(function (e) {
                e.preventDefault();
                // Save new title to event obj
                calEvent.title = $('#change-event-desc').val();
                // Save new event background to event obj
                calEvent.backgroundColor = $('#change-event-color').css('background-color');
                // Update event data from db
                if(updateEvent(calEvent)){
                    // Update event obj to show current values
                    $('#calendar').fullCalendar( 'updateEvent', calEvent );
                }
            });

            let $deleteBtn = $('#delete');
            $deleteBtn.unbind();// Remove a previously-attached event handler from the elements
            // Delete event after clicking delete button
            $deleteBtn.click(function (e) {
                e.preventDefault();
                // Delete event from db
                if(deleteEvent(calEvent)){
                    // Refetch all events
                    $('#calendar').fullCalendar('refetchEvents');
                }
            });
        }
    });


    /* ADDING NEW EVENTS */
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


    function addEvent(event){
        $.post(
            'calendar/add',
            {
                title   : event.title,
                start   : (event.start._d).toJSON(),
                bgColor : event.backgroundColor
            }
        ).done(function() {
            messageBox('success', 'Uus sündmus kalendrisse lisatud :)');
        });
    }

    function updateEvent(event) {
        if(!event.end ) {
            event.end = event.start;
        }
        $.post(
            'calendar/update',
            {
                id      : event.id,
                title   : event.title,
                start   : (event.start._d).toJSON(),
                end     : (event.end._d).toJSON(),
                allDay  : event.allDay,
                bgColor : event.backgroundColor
            }
        ).done(function() {
            messageBox('success', 'Sündmus uuendatud :)');
        });
        return true;
    }

    function deleteEvent(event) {
        $.post(
            'calendar/delete',
            {
                id : event.id,
            }
        ).done(function() {
            messageBox('alert', 'Sündmus kustutatud');
        });
        return true;
    }

});