// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


$(document).ready(function(){
	var app_data = $("#app-data"), app = {
		name: app_data.data('name'),
		age: app_data.data('age'),
		gender: app_data.data('gender'),
		bio: app_data.data('bio')
	};

	if (app.name !== null){
		console.log("test")
		var apiKey = app_data.data('api'), 
		sessionId = app_data.data('session'),
		token = app_data.data('token');

		var session, publisher;
		var subscribers = {};
		var VIDEO_WIDTH = 320;
		var VIDEO_HEIGHT = 240;

		TB.addEventListener("exception", exceptionHandler);
		
		// Un-comment the following to set automatic logging:
		// TB.setLogLevel(TB.DEBUG);

		if (TB.checkSystemRequirements() != TB.HAS_REQUIREMENTS) {
			alert("You don't have the minimum requirements to run this application."
				  + "Please upgrade to the latest version of Flash.");
		} else {
			session = TB.initSession(sessionId);	// Initialize session

			// Add event listeners to the session
			session.addEventListener('sessionConnected', sessionConnectedHandler);
			session.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
			session.addEventListener('connectionCreated', connectionCreatedHandler);
			session.addEventListener('connectionDestroyed', connectionDestroyedHandler);
			session.addEventListener('streamCreated', streamCreatedHandler);
			session.addEventListener('streamDestroyed', streamDestroyedHandler);
		}

		//--------------------------------------
		//  LINK CLICK HANDLERS
		//--------------------------------------

		/*
		If testing the app from the desktop, be sure to check the Flash Player Global Security setting
		to allow the page from communicating with SWF content loaded from the web. For more information,
		see http://www.tokbox.com/opentok/build/tutorials/helloworld.html#localTest
		*/
		function connect() {
			session.connect(apiKey, token);	
			console.log(session.subscribers);

		}

		function disconnect() {
			session.disconnect();
			hide('disconnectLink');
			hide('publishLink');
			hide('unpublishLink');
		}

		$("#disconnectLink").on('click', function() {
			disconnect();
		});

		$("#connectLink").on('click', function() {
			connect();
		});

		// Called when user wants to start publishing to the session
		function startPublishing() {
			console.log(session);
			if (!publisher) {
				$("#myCamera").html("");
				var parentDiv = document.getElementById("myCamera");
				var publisherDiv = document.createElement('div'); // Create a div for the publisher to replace
				publisherDiv.setAttribute('id', 'opentok_publisher');
				parentDiv.appendChild(publisherDiv);
				var publisherProps = {width: VIDEO_WIDTH, height: VIDEO_HEIGHT};
				publisher = TB.initPublisher(apiKey, publisherDiv.id, publisherProps);  // Pass the replacement div id and properties
				session.publish(publisher, {name: "John Doe"} );
				show('unpublishLink');
				hide('publishLink');
			}
		}

		function stopPublishing() {
			if (publisher) {
				session.unpublish(publisher);
			}
			publisher = null;

			show('publishLink');
			hide('unpublishLink');
		}

		//--------------------------------------
		//  OPENTOK EVENT HANDLERS
		//--------------------------------------

		function sessionConnectedHandler(event) {
			for (var i = 0; i < event.streams.length; i++) {
				addStream(event.streams[i]);
			}
			show('disconnectLink');
			show('publishLink');
			hide('connectLink');
			show('session_id');
			show('joinStream');
			startPublishing();
			var stateManager = session.getStateManager();
			stateManager.addEventListener("changed", stateChangedHandler);
		}

		function stateChangedHandler(event) {
			console.log(event);
		    for (key in event.changedValues) {
		        // alert("Changed state. Key: " + key + ". Value: " + event.changedValues[key]);
		        console.log($(".chat nav-list"));
		        $(".chat .nav-list").append("<li style='padding: 10px 0'><span style='color: #2fa4e7'>" + key + ":</span>" + event.changedValues[key] +"</li>").promise().done(function() {
				    $('.chat .nav').animate({
         				scrollTop: $(".chat .nav li:last").offset().top
     				}, 1000);
				});
		    }
		}		

		function streamCreatedHandler(event) {
			// Subscribe to the newly created streams
			for (var i = 0; i < event.streams.length; i++) {
				addStream(event.streams[i]);
			}
		}

		function streamDestroyedHandler(event) {
			// This signals that a stream was destroyed. Any Subscribers will automatically be removed.
			// This default behaviour can be prevented using event.preventDefault()
		}

		function sessionDisconnectedHandler(event) {
			// This signals that the user was disconnected from the Session. Any subscribers and publishers
			// will automatically be removed. This default behaviour can be prevented using event.preventDefault()
			publisher = null;

			show('connectLink');
			hide('disconnectLink');
			hide('publishLink');
			hide('unpublishLink');
		}

		function connectionDestroyedHandler(event) {
			// This signals that connections were destroyed
		}

		function connectionCreatedHandler(event) {
			// This signals new connections have been created.
		}

		/*
		If you un-comment the call to TB.setLogLevel(), above, OpenTok automatically displays exception event messages.
		*/
		function exceptionHandler(event) {
			alert("Exception: " + event.code + "::" + event.message);
		}

		//--------------------------------------
		//  HELPER METHODS
		//--------------------------------------

		function addStream(stream) {
			// Check if this is the stream that I am publishing, and if so do not publish.
			if (stream.connection.connectionId == session.connection.connectionId) {
				return;
			}
			var subscriberDiv = document.createElement('div'); // Create a div for the subscriber to replace
			subscriberDiv.setAttribute('id', stream.streamId); // Give the replacement div the id of the stream as its id.
			document.getElementById("subscribers").appendChild(subscriberDiv);
			var subscriberProps = {width: VIDEO_WIDTH, height: VIDEO_HEIGHT};
			subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, subscriberProps);
		}

		$("#joinStream").on("click", function(){
			$("#connect_container").show();
		});

		function show(id) {
			document.getElementById(id).style.display = 'block';
		}

		function hide(id) {
			document.getElementById(id).style.display = 'none';
		}

		// function nextStream(){
		// 	var streams = <%= params[:streams] %>;
		// 	for (var i = 0; i < streams.length; i++) {
		// 		session.connect(apiKey, streams[i][2]);	
		// 	}
		// }	

		show('connectLink');	
	}

	$(".join_chat").click(function(){
		if ($(".chat_id").val().length === 0){
			alert("Enter chat id");
		}else{
			window.location.href = "/vchat?stream=" + $(".chat_id").val() + "&name=" + app.name + "&age=" + app.age + "&gender=" + app.gender + "&bio=" + app.bio;				
		}
		return false;
	});

	$(".chat-form").submit(function(e){
		e.preventDefault();
		var txt = $(".chat-input").val();
		var stateManager = session.getStateManager();
		stateManager.set(name, txt);
		$(".chat-input").val("");
		return false;
	});


	app.name ? connect() : $('#infoModal').modal('show');

	// Popover 
	$('#infoForm input').focus(function(){
		$(this).popover('show');	
	}).blur(function(){
		$(this).popover('hide');	
	});

	// Validation
	$("#infoForm").validate({
		rules:{
			name:{required:true},
			age:{required:true},
			bio:{required:true}
		},
		messages:{
			user_name:{ required:"Enter your name" },
			age:{ required:"Enter your age" },
			bio:{ required:"Enter your bio"}
		},

		errorClass: "help-inline",
		errorElement: "span",
		highlight:function(element, errorClass, validClass){
			$(element).parents('.control-group').addClass('error');
		},
		unhighlight: function(element, errorClass, validClass){
			$(element).parents('.control-group').removeClass('error');
			$(element).parents('.control-group').addClass('success');
		}
	});		
});