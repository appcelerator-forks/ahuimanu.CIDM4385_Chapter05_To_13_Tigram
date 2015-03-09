//get the parameters passed to the controller
var parameters = arguments[0] || {};
var currentPhoto = parameters.photo || {};
var parentController = parameters.parentController ||{};

/*
 * WE need to load comments into the view when the controller is opened.
 * 
 * We create two functions:
 * 1) initialization which is exported (via the $ variable) so we can initialize or re-initialize the controller - 
 *    we call loadComments
 * 2) loadComments - query ACS to get a list of comments associated with the current photo object
 */


//we'll use this comments collection throughout the controller
var comments = Alloy.Collections.instance("Comment");


/**
 * Load comments from ACS
 * @param {Object} _photo_id
 */
function loadComments(_photo_id) {

	var params = {
		photo_id : currentPhoto.id,
		order : '-created_at',
		per_page : 100
	};
	
	var rows = [];	

	//this is a backbone method - fetch
	comments.fetch({
		data : params,
		success : function(model, response) {
			comments.each(function(comment) {
				var commentRow = Alloy.createController("commentRow", comment);
				rows.push(commentRow.getView());
			});
			// set the table rows
			$.commentTable.data = rows;
		},
		error : function(error) {
			alert('Error loading comments ' + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});

}



$.initialize = function()
{
	loadComments();
};

/* we create the doOpen function to provide Android support when the
 * comments view opens
 */

function doOpen()
{
	if(OS_ANDROID)
	{
		var activity = $.getView().activity;
		var actionBar = activity.actionBar;
		
		activity.onCreateOptionsMenu = function(_event){
			if(actionBar)
			{
				actionBar.displayHomeAsUp = true;
				actionBar.onHomeIconSelected = function(){
					$.getView().close();
				};
			}
			else{
				alert("No Action Bar Found");
			}
		};
		
		//add the button and menu to the titlebar
		var menuItem = _event.menu.add(
			{
				title: "New Comment",
				showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
				icon: Ti.Android.R.drawable.ic_menu_edit
			}
		);
		
		//event listener
		menuItem.addEventListener("click", function(e){
			handleNewCommentButtonClicked();
		});
	}
}

OS_IOS && $.newComentButton.addEventListener("click", handleNewCommentButtonClicked);

//the event-handling function
function handleNewCommentButtonClicked(_event)
{
	//TO DO
}
