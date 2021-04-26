var LANGUAGE_VERSIONS = { FR: 'FR', EN: 'EN', ES: 'ES', IT: 'IT', DE: 'DE' }
var path = 'C:\\praca\\adobe\\24.01.PEUGEOT 307\\support\\'
var project = app.project

var projectItem = project.rootItem

function createLangueVerions(name) {
  if (name === null) {
    alert('Pusta nazwa pliku!!!')
    exit()
  }
  var parts = name.split(LANGUAGE_VERSIONS.FR)
  var names = []
  names.push(parts[0] + LANGUAGE_VERSIONS.EN + parts[1])
  names.push(parts[0] + LANGUAGE_VERSIONS.ES + parts[1])
  names.push(parts[0] + LANGUAGE_VERSIONS.IT + parts[1])
  names.push(parts[0] + LANGUAGE_VERSIONS.DE + parts[1])
  return names
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
}

function handleClip(baseClip, folder, startingTrack) {
  var name = baseClip.name
  var names = createLangueVerions(name)
  var paths = createPaths(path, names)
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

$.runScript = {
  alert: function () {
    app.enableQE()
    var videoTracks = project.activeSequence.videoTracks
    var mainFrTrack = videoTracks[3]
    var pointersTrack = videoTracks[4]
    var frPointers = pointersTrack.clips

    var frClips = mainFrTrack.clips
    addVideoTracks()

    for (var i = 0; i < frClips.length; i++) {
      if (i === 0) {
        handleClip(frClips[i], 'INTRO', 5)
      } else if (i === frClips.length - 1) {
        handleClip(frClips[i], 'OUTRO', 5)
      } else {
        handleClip(frClips[i], 'CTA', 5)
      }
    }

    for (var i = 0; i < frPointers.length; i++) {
      handleClip(frPointers[i], 'POINTERS', 6)
      addEffects(i, frPointers[i], 6)
    }
  },
}
