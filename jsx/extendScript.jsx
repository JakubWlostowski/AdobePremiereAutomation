var LANGUAGE_VERSIONS = { FR: 'FR', EN: 'EN', ES: 'ES', IT: 'IT', DE: 'DE' }
var path = ''
var project = app.project
var outputPresetPath = "C:\\Users\\The Beast\\Documents\\Adobe\\Adobe Media Encoder\\22.0\\Presets\\MINOTHOR.epr"
var STARTING_TRACK = 5
var projectItem = project.rootItem

function getDirectoryPath() {
	var myFolder = Folder.selectDialog ("Select a folder containing your video files");
	path = myFolder.fsName + "\\"
}

function createLanguageVerions(name, append_french_version) {
  if (name === null) {
    alert('Empty file name!')
    exit()
  }
  var parts = name.split(LANGUAGE_VERSIONS.FR)
  var names = []
  if (append_french_version) {
    names.push(parts[0] + LANGUAGE_VERSIONS.FR + parts[1])
  }
  names.push(parts[0] + LANGUAGE_VERSIONS.EN + parts[1])
  names.push(parts[0] + LANGUAGE_VERSIONS.ES + parts[1])
  names.push(parts[0] + LANGUAGE_VERSIONS.IT + parts[1])
  names.push(parts[0] + LANGUAGE_VERSIONS.DE + parts[1])
  return names
}

function getBin(projectPath){
  var insidePath = projectPath.split('\\')
  var valueToReturn = insidePath[2] !== null ? insidePath[2] : insidePath[1]
  return valueToReturn
}

function createPaths(basicPath, names) {
  var paths = []
  paths.push(basicPath + names[0])
  paths.push(basicPath + names[1])
  paths.push(basicPath + names[2])
  paths.push(basicPath + names[3])
  return paths
}

function findChildItem(node, name) {
  for (var i = 0; i < node.children.numItems; i++) {
    if ((tempName = node.children[i].name === name)) {
      return i
    }
  }
  return -1
}

function addVideoTracks() {
  var seq = qe.project.getActiveSequence()
  seq.addTracks(8, 5)
  seq.removeAudioTrack(0)
}

function removeVideoTracks(){
  var seq = qe.project.getActiveSequence()
  for(var i = 0; i< 8;i++)
    seq.removeVideoTrack(5)
  app.project.consolidateDuplicates()
}

function handleClip(baseClip, folder, startingTrack) {
  var name = baseClip.name
  var names = createLanguageVerions(name, false)
  var paths = createPaths(path+folder+"\\", names)
  var bin = projectItem.children[findChildItem(projectItem, folder)]

  app.project.importFiles(paths, false, bin, false)
  addClips(bin, names, baseClip, startingTrack)
}

function addClips(bin, names, clip, startingTrack) {
  for (var i = 0; i < names.length; i++) {
    var item = bin.children[findChildItem(bin, names[i])]
    item.setColorLabel(i)
    item.setScaleToFrameSize()
    var track = project.activeSequence.videoTracks[startingTrack + 2 * i]
    track.insertClip(item, clip.start.ticks)
  }
}

function addEffects(itemIndex, clip, startingTrack) {
  for (var i = 0; i < 4; i++) {
    var track = project.activeSequence.videoTracks[startingTrack + 2 * i]
    var pointer = track.clips[itemIndex]
    var frComponets = clip.components
    var effect
    for (var j = 0; j < frComponets.numItems; j++) {
      if (frComponets[j].displayName === 'Motion') {
        effect = frComponets[j]
      }
    }

    var pointerComponents = pointer.components
    var pointerEffect
    for (var j = 0; j < pointerComponents.numItems; j++) {
      if (pointerComponents[j].displayName === 'Motion') {
        pointerEffect = pointerComponents[j]
      }
    }

    var position = effect.properties[0].getValue()
    var rotation = effect.properties[4].getValue()
    pointerEffect.properties[0].setValue(position, true)
    pointerEffect.properties[4].setValue(rotation, true)
  }
}

function renderSequence(outputPresetPath, exportName, outputPath) {
		app.enableQE();
		var activeSequence = qe.project.getActiveSequence();
		if (activeSequence)	{
			//app.encoder.launchEncoder();
			var seqInPoint	= app.project.activeSequence.getInPoint();
			var seqOutPoint	= app.project.activeSequence.getOutPoint();

			if (outputPath){

				var outPreset		= new File(outputPresetPath);
				if (outPreset.exists === true){

					var outputFormatExtension		=	activeSequence.getExportFileExtension(outPreset.fsName);
					if (outputFormatExtension){
						var outputFilename	= 	activeSequence.name + '.' + outputFormatExtension;

						var fullPathToFile	= 	outputPath.fsName 	+ 
												"\\" 	+ 
												exportName + 
												"." + 
												outputFormatExtension;			

						var outFileTest = new File(fullPathToFile);

						if (outFileTest.exists){
							var destroyExisting	= confirm("A file with that name already exists; overwrite?", false, "Are you sure...?");
							if (destroyExisting){
								outFileTest.remove();
								outFileTest.close();
							}
						}
          }
        }
      }
			var jobID = app.encoder.encodeSequence(	app.project.activeSequence,
													fullPathToFile,
													outPreset.fsName,
													app.encoder.ENCODE_WORKAREA, 0);				
			outPreset.close();
	}
}
function checkLanguageTrack(language, track, number){
  for(var i = 0; i<track.clips.length;i++){
    var name = track.clips[i].name
    if(name.indexOf(language) == -1 && name.indexOf(language.toLowerCase()) == -1){
      alert('Audio file '+ name + ' on track ' + (number + 1) +' is on the wrong audio track!!!')
    }
  }
}

function exportFiles() {
  var videoTracks = project.activeSequence.videoTracks
  var audioTracks = project.activeSequence.audioTracks
  var startingVideoTrack = 3
  var startingAudioTrack = 2
  var names = createLanguageVerions(project.activeSequence.name, true)
  var outputPath  = Folder.selectDialog("Choose the output directory");
  for (var j = 0; j < 5; j++) {
    for (var i = 0; i < 13; i++) {
      if (i === startingVideoTrack || i === startingVideoTrack + 1 || i < 3){
        videoTracks[i].setMute(0)
      }
      else
        videoTracks[i].setMute(1)
      if (i === startingAudioTrack || i === startingAudioTrack + 1 || i === 12) {
        audioTracks[i].setMute(0)
      }
      else
        audioTracks[i].setMute(1)
    }
    renderSequence(outputPresetPath, names[j], outputPath)
    startingVideoTrack += 2
    startingAudioTrack += 2
  }
}
$.runScript = {
  importFilesToSequence: function () {
    	app.enableQE()

	getDirectoryPath()
	var videoTracks = project.activeSequence.videoTracks
	var mainFrTrack = videoTracks[3]
	var pointersTrack = videoTracks[4]
	var frPointers = pointersTrack.clips

	var frClips = mainFrTrack.clips

	addVideoTracks()

	for (var i = 0; i < frClips.length; i++) {
	    var projectPath = frClips[i].projectItem.treePath
	    handleClip(frClips[i], getBin(projectPath), STARTING_TRACK)
	    addEffects(i, frClips[i], STARTING_TRACK)
	}

	for (var i = 0; i < frPointers.length; i++) {
	    var projectPath = frPointers[i].projectItem.treePath
	    handleClip(frPointers[i], getBin(projectPath), STARTING_TRACK + 1)
	    addEffects(i, frPointers[i], STARTING_TRACK + 1)
	}
	app.project.consolidateDuplicates()
  },
  undoToStartingPosition: function(){
	var mySeq = app.project.activeSequence
	for(var i = STARTING_TRACK; i < 13; i++){
	  var videos = mySeq.videoTracks[i]
	  while(videos.clips.length > 0){
	    videos.clips[0].remove(0, 0)
	  }
	  var sounds = mySeq.audioTracks[i]
	  while( i%2==1 && sounds.clips.length > 0){
	    sounds.clips[0].remove(0, 0)
	  }
	}
	removeVideoTracks()
  },	
  checkLanguageVersion: function () {
	var audioTracks = project.activeSequence.audioTracks

	frAudioTrack = audioTracks[2]
	enAudioTrack = audioTracks[4]
	esAudioTrack = audioTracks[6]
	itAudioTrack = audioTracks[8]
	deAudioTrack = audioTracks[10]
	checkLanguageTrack('FR', frAudioTrack, 2)
	checkLanguageTrack('EN', enAudioTrack, 4)
	checkLanguageTrack('ES', esAudioTrack, 6)
	checkLanguageTrack('IT', itAudioTrack, 8)
	checkLanguageTrack('DE', deAudioTrack, 10)
  },
  exportVideos: function () {
    	exportFiles()
  }
}