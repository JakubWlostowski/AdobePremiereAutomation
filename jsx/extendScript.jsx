var project = app.project;
var projectItem = project.rootItem;
function isVideoName(name) {
    var extensions = [".mp4", ".m4a", ".m4v", ".f4v", ".f4a", ".m4b", ".mov", ".f4b", ".3gp", ".ogg", ".wmv", ".asf", ".webm", ".flv", ".avi", ".hdv", ".mxf", ".mpg", ".mpeg", ".mpeg2", ".vob", ".mp5"];
    for(var i = 0; i < extensions.length; i++) {
        if(name.indexOf(extensions[i]) != -1) {
            return true;
            }
        }
        return false;
    }

function isAudioName(name) {
    var extensions = [".mp3", ".ogg", ".m4a", ".f4a", ".wma", ".wav", ".mxf"];
    for(var i = 0; i < extensions.length; i++) {
        if(name.indexOf(extensions[i]) != -1) {
            return true;
            }
        }
        return false;
    }

$.runScript = {

	alert: function() {
	app.enableQE();
	var tempName, thisName, thisSequence;
	var videoTrackIndex = 2;
	var audioTrackIndex = 0;
	thisSequence = project.createNewSequence("ExampleProject", "ExampleProject");
	var seq = qe.project.getActiveSequence();
	for(var i = 0;i < 11;i++)
	{
		seq.removeTracks();
	}
	for(var i = 0;i < 11;i++)
	{
		seq.addTracks();
	}
	for(var i = 0;i < projectItem.children.numItems;i++)
	{
		tempName = projectItem.children[i].getMediaPath();
		thisName = tempName.slice(tempName.lastIndexOf("\\") + 1, tempName.length);
		if(thisName.indexOf("INTRO") != -1 && isVideoName(thisName))
		{
			projectItem.children[i].setScaleToFrameSize();
			project.activeSequence.videoTracks[videoTrackIndex].insertClip(projectItem.children[i], 0);
			videoTrackIndex = videoTrackIndex + 2;
		}
	}
}	
    
}