/* ********** WEBSOCKET  MODULE SPECIFIC SCRIPTING ********************* */
/*

Streaming Modules (i.e. UDP and Serial Module) have specific methods that can be used to handle receiving and sendin data over the connection.
With streaming modules, there are 2 ways of sending data : either as a UTF-8 String or as separate bytes

local.sendBytes(30,210,46,255,10); //This will send all the bytes passed in as they are

*/

/*
You can intercept all the received data from this module with the method dataReceived(data).
Depending on the Protocol you chose, the nature of the data passed in this function will be different.
*/

/*function dataReceived(data)
{
	//If mode is "Lines", you can expect data to be a single line String
	script.log("Data received : " +data);
	
	//If mode is anything else, you can expect data to be an array of bytes
	script.log("Bytes received : "+data.length);
	for(var i=0; i < data.length; i++)
	{
		script.log(" > " + data[i]);
	}
}*/




/* ********** STREAMING MODULE (UDP, TCP, SERIAL, WEBSOCKET) SPECIFIC SCRIPTING ********************* */
/*

Websoskets modules can be used as standard Streaming Module and use the dataReceived function above, 
but you can also intercept messages and data directly from the streaming, before it is processed, using specific 
event callbacks below
*/
function wsMessageReceived(message) {
	script.log("Websocket data received : " + message);
	var obsObj = JSON.parse(message);
	if (obsObj.op == 0 && obsObj.d.authentication != null) {
		var mdp = "7TUBogT5FArWktZz" + obsObj.d.authentication.salt;
		script.log("mdp = " + mdp);
		var Encode1 = util.toBase64(util.encodeSHA256(mdp));
		script.log("Encode1 = " + Encode1);
		var Encode2 = util.toBase64(util.encodeSHA256(Encode1 + obsObj.d.authentication.challenge));
		script.log("Encode2 = " + Encode2);
		
		local.send('{"d":{"authentication": "'+Encode2+'", "eventSubscriptions": 1048655, "rpcVersion": 1}, "op": 1}');
		

	}
	else if (obsObj.op == 0) {
		local.send('{   "op": 1,   "d": {     "rpcVersion": 1,     "authentication": "test1",     "eventSubscriptions": 33   } }');
	}
}

function wsDataReceived(data) {
	script.log("Websocket data received : " + data);
}

function sendObsCommand(req, data, reqId) {
	var send = {};
	var para = {};
	para["requestType"] = req;
	para["requestId"] = reqId;
	para["requestData"] = data;

	/*!== undefined ? data : {}*/
	send["op"] = 6;
	send["d"] = para;

	script.log(JSON.stringify(send));
	local.send(JSON.stringify(send));
}

function sendObsRawCommand(json) {
	local.send(json);
}

function OBSPlayMedia(source) {
	var data = {};
	data["inputName"] = source;
	data["mediaAction"] = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY";
	sendObsCommand("TriggerMediaInputAction", data);
}

function OBSPauseMedia(source) {
	var data = {};
	data["inputName"] = source;
	data["mediaAction"] = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PAUSE";
	sendObsCommand("TriggerMediaInputAction", data);
}

function OBSRestartMedia(source) {
	var data = {};
	data["inputName"] = source;
	data["mediaAction"] = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART";
	sendObsCommand("TriggerMediaInputAction", data);
}

function OBSStopMedia(source) {
	var data = {};
	data["inputName"] = source;
	data["mediaAction"] = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_STOP";
	sendObsCommand("TriggerMediaInputAction", data);
}

function OBSNextMedia(source) {
	var data = {};
	data["inputName"] = source;
	data["mediaAction"] = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NEXT";
	sendObsCommand("TriggerMediaInputAction", data);
}

function OBSPreviousMedia(source) {
	var data = {};
	data["inputName"] = source;
	data["mediaAction"] = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PREVIOUS";
	sendObsCommand("TriggerMediaInputAction", data);
}

function OBSSetMediaTime(source, time) {
	var data = {};
	data["inputName"] = source;
	data["mediaCursor"] = time;
	sendObsCommand("SetMediaInputCursor", data);
}

/*to checked/to find*/
function OBSGetMediaTime(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("GetMediaTime", data);
}

/*to checked/to find*/
function OBSScrubMedia(source, time) {
	var data = {};
	data["sourceName"] = source;
	data["timeOffset"] = time;
	sendObsCommand("ScrubMedia", data);
}

/*to checked*/
function OBSSetMute(source, val) {
	var data = {};
	data["inputName"] = source;
	data["inputMuted"] = val;
	sendObsCommand("SetInputMute", data);
}

function OBSToggleMute(source, val) {
	var data = {};
	data["inputName"] = source;
	sendObsCommand("ToggleInputMute", data);
}

/*checked*/
function OBSTakeSourceScreenshot(source, format, path) { // "png", "jpg", "jpeg" or "bmp", 
	var data = {};
	data["sourceName"] = source;
	data["imageFormat"] = format;
	data["imageFilePath"] = path;
	sendObsCommand("SaveSourceScreenshot", data);
}

/*to checked/to find*/
function OBSRefreshBrowserSource(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("RefreshBrowserSource", data);
}

function OBSSetCurrentProfile(name) {
	var data = {};
	data["profileName"] = name;
	sendObsCommand("SetCurrentProfile", data);
}

function OBSStartRecording() {
	var data = {};
	sendObsCommand("StartRecord", data);
}

function OBSStopRecording() {
	var data = {};
	sendObsCommand("PauseRecord", data);
}

function OBSPauseRecording() {
	var data = {};
	sendObsCommand("ToggleRecordPause", data);
}

function OBSResumeRecording() {
	var data = {};
	sendObsCommand("ResumeRecord", data);
}

function OBSSetCurrentSceneCollection(name) {
	var data = {};
	data["sceneCollectionName"] = name;
	sendObsCommand("SetCurrentSceneCollection", data);
}

function OBSSetCurrentScene(name) {
	var data = {};
	data["sceneName"] = name;
	sendObsCommand("SetCurrentProgramScene", data);
}

function OBSSetSceneTransitionOverride(name, transitionName, transitionDuration) {
	var data = {};
	data["sceneName"] = name;
	data["transitionName"] = transitionName;
	data["transitionDuration"] = transitionDuration;
	sendObsCommand("SetSceneSceneTransitionOverride", data);
}

function OBSSetPreviewScene(name) {
	var data = {};
	data["sceneName"] = name;
	sendObsCommand("SetCurrentPreviewScene", data);
}

function OBSSetCurrentTransition(name) {
	var data = {};
	data["transitionName"] = name;
	sendObsCommand("SetCurrentSceneTransition", data);
}

function OBSSetTransitionDuration(duration) {
	var data = {};
	data["transitionDuration"] = duration;
	sendObsCommand("SetCurrentSceneTransitionDuration", data);
}






//---------------------------------------------------------------------------------
/*General Requests Menu*/
function GetVersion(reqId) {
	var data = {};
	sendObsCommand("GetVersion", data, reqId);
}

function GetStats(reqId) {
	var data = {};
	sendObsCommand("GetStats", data, reqId);
}

function BroadcastCustomEvent(reqId) {
	var data = {};
	sendObsCommand("BroadcastCustomEvent", data, reqId);
}

function BroadcastCustomEvent(reqId, vendorName, requestType, requestData) {
	var data = {};
	data["vendorName"] = vendorName;
	data["requestType"] = requestType;
	data["requestData"] = requestData;
	sendObsCommand("BroadcastCustomEvent", data, reqId);
}

function GetHotkeyList(reqId) {
	var data = {};
	sendObsCommand("GetHotkeyList", data, reqId);
}

function TriggerHotkeyByName(reqId, hotkeyName) {
	var data = {};
	data["hotkeyName"] = hotkeyName;
	sendObsCommand("TriggerHotkeyByName", data, reqId);
}

function TriggerHotkeyByKeySequence(reqId, keyId, shift, control, alt, command) {
	var data = {};
	data["keyId"] = keyId;
	data["keyModifiers"]["shift"] = shift;
	data["hotkeyName"]["control"] = control;
	data["hotkeyName"]["alt"] = alt;
	data["hotkeyName"]["command"] = command;
	sendObsCommand("TriggerHotkeyByKeySequence", data, reqId);
}

//---------------------------------------------------------------------------------
/*Config requests Menu*/
function Sleep(reqId, sleepMillis, sleepFrames) {
	var data = {};
	data["sleepMillis"] = sleepMillis;
	data["sleepFrames"] = sleepFrames;
	sendObsCommand("Sleep", data, reqId);
}

function GetPersistentData(reqId, realm, slotName) {
	var data = {};
	data["realm"] = realm;
	data["slotName"] = slotName;
	sendObsCommand("GetPersistentData", data, reqId);
}

function SetPersistentData(reqId, realm, slotName, slotValue) {
	var data = {};
	data["realm"] = realm;
	data["slotName"] = slotName;
	data["slotValue"] = slotValue;
	sendObsCommand("SetPersistentData", data, reqId);
}

function GetSceneCollectionList(reqId) {
	var data = {};
	sendObsCommand("GetSceneCollectionList", data, reqId);
}

function SetCurrentSceneCollection(reqId, sceneCollectionName) {
	var data = {};
	data["sceneCollectionName"] = sceneCollectionName;
	sendObsCommand("SetCurrentSceneCollection", data, reqId);
}

function CreateSceneCollection(reqId, sceneCollectionName) {
	var data = {};
	data["sceneCollectionName"] = sceneCollectionName;
	sendObsCommand("CreateSceneCollection", data, reqId);
}

function GetProfileList(reqId) {
	var data = {};
	sendObsCommand("GetProfileList", data, reqId);
}

function SetCurrentProfile(reqId, profileName) {
	var data = {};
	data["profileName"] = profileName;
	sendObsCommand("SetCurrentProfile", data, reqId);
}

function CreateProfile(reqId, profileName) {
	var data = {};
	data["profileName"] = profileName;
	sendObsCommand("CreateProfile", data, reqId);
}

function RemoveProfile(reqId, profileName) {
	var data = {};
	data["profileName"] = profileName;
	sendObsCommand("RemoveProfile", data, reqId);
}

function GetProfileParameter(reqId, parameterCategory, parameterName) {
	var data = {};
	data["parameterCategory"] = parameterCategory;
	data["parameterName"] = parameterName;
	sendObsCommand("GetProfileParameter", data, reqId);
}

function SetProfileParameter(reqId, parameterCategory, parameterName, parameterValue) {
	var data = {};
	data["parameterCategory"] = parameterCategory;
	data["parameterName"] = parameterName;
	data["parameterValue"] = parameterValue;
	sendObsCommand("SetProfileParameter", data, reqId);
}

function GetVideoSettings(reqId) {
	var data = {};
	sendObsCommand("GetVideoSettings", data, reqId);
}

function SetVideoSettings(reqId, fpsNumerator, fpsDenominator, baseWidth, baseHeight, outputWidth, outputHeight) {
	var data = {};
	data["fpsNumerator"] = fpsNumerator;
	data["fpsDenominator"] = fpsDenominator;
	data["parametbaseWidtherValue"] = baseWidth;
	data["baseHeight"] = baseHeight;
	data["outputWidth"] = outputWidth;
	data["outputHeight"] = outputHeight;
	sendObsCommand("SetVideoSettings", data, reqId);
}

function GetStreamServiceSettings(reqId) {
	var data = {};
	sendObsCommand("GetStreamServiceSettings", data, reqId);
}

function SetStreamServiceSettings(reqId, streamServiceType, streamServiceSettings) {
	var data = {};
	data["streamServiceType"] = streamServiceType;
	data["streamServiceSettings"] = streamServiceSettings;
	sendObsCommand("SetStreamServiceSettings", data, reqId);
}

function GetRecordDirectory(reqId) {
	var data = {};
	sendObsCommand("GetRecordDirectory", data, reqId);
}

//---------------------------------------------------------------------------------
/*Sources Requests Menu*/
function GetSourceActive(reqId, sourceName) {
	var data = {};
	data["sourceName"] = sourceName;
	sendObsCommand("GetSourceActive", data, reqId);
}

function GetSourceScreenshot(reqId, sourceName, imageFormat, imageWidth, imageHeight, imageCompressionQuality) {
	var data = {};
	data["sourceName"] = sourceName;
	data["imageFormat"] = imageFormat;
	data["imageWidth"] = imageWidth;
	data["imageHeight"] = imageHeight;
	data["imageCompressionQuality"] = imageCompressionQuality;
	sendObsCommand("GetSourceScreenshot", data, reqId);
}

function SaveSourceScreenshot(reqId, sourceName, imageFormat, imageFilePath, imageWidth, imageHeight, imageCompressionQuality) {
	var data = {};
	data["sourceName"] = sourceName;
	data["imageFormat"] = imageFormat;
	data["imageFilePath"] = imageFilePath;
	data["imageWidth"] = imageWidth;
	data["imageHeight"] = imageHeight;
	data["imageCompressionQuality"] = imageCompressionQuality;
	sendObsCommand("SaveSourceScreenshot", data, reqId);
}

//---------------------------------------------------------------------------------
/*Scenes Requests menu*/
function GetSceneList(reqId, currentProgramSceneName, currentPreviewSceneName, scenes) {
	var data = {};
	data["currentProgramSceneName"] = currentProgramSceneName;
	data["currentPreviewSceneName"] = currentPreviewSceneName;
	data["scenes"] = scenes;
	sendObsCommand("GetSceneList", data, reqId);
}

function GetGroupList(reqId, groups, currentPreviewSceneName, scenes) {
	var data = {};
	data["groups"] = groups;
	sendObsCommand("GetGroupList", data, reqId);
}

function GetCurrentProgramScene(reqId, currentProgramSceneName) {
	var data = {};
	data["currentProgramSceneName"] = currentProgramSceneName;
	sendObsCommand("GetCurrentProgramScene", data, reqId);
}

function SetCurrentProgramScene(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("SetCurrentProgramScene", data, reqId);
}

function GetCurrentPreviewScene(reqId, currentPreviewSceneName) {
	var data = {};
	data["currentPreviewSceneName"] = currentPreviewSceneName;
	sendObsCommand("GetCurrentPreviewScene", data, reqId);
}

function SetCurrentPreviewScene(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("SetCurrentPreviewScene", data, reqId);
}

function CreateScene(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("CreateScene", data, reqId);
}

function RemoveScene(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("RemoveScene", data, reqId);
}

function SetSceneName(reqId, sceneName, newSceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	data["newSceneName"] = newSceneName;
	sendObsCommand("SetSceneName", data, reqId);
}

function GetSceneSceneTransitionOverride(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("GetSceneSceneTransitionOverride", data, reqId);
}

function SetSceneSceneTransitionOverride(reqId, sceneName, transitionName,transitionDuration) {
	var data = {};
	data["sceneName"] = sceneName;
	data["transitionName"] = transitionName;
	data["transitionDuration"] = transitionDuration;
	sendObsCommand("SetSceneSceneTransitionOverride", data, reqId);
}

//---------------------------------------------------------------------------------
/*Inputs Requests menu*/
function GetInputList(reqId, inputKind) {
	var data = {};
	data["inputKind"] = inputKind;
	sendObsCommand("GetInputList", data, reqId);
}

function GetInputKindList(reqId, unversioned) {
	var data = {};
	data["unversioned"] = unversioned;
	sendObsCommand("GetInputKindList", data, reqId);
}

function GetSpecialInputs(reqId) {
	var data = {};
	sendObsCommand("GetSpecialInputs", data, reqId);
}

function CreateInput(reqId, sceneName, inputName, inputKind, inputSettings, sceneItemEnabled) {
	var data = {};
	data["sceneName"] = sceneName;
	data["inputName"] = inputName;
	data["inputKind"] = inputKind;
	data["inputSettings"] = inputSettings;
	data["sceneItemEnabled"] = sceneItemEnabled;
	sendObsCommand("CreateInput", data, reqId);
}

function RemoveInput(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("RemoveInput", data, reqId);
}

function SetInputName(reqId, inputName, newInputName) {
	var data = {};
	data["inputName"] = inputName;
	data["newInputName"] = newInputName;
	sendObsCommand("SetInputName", data, reqId);
}

function GetInputDefaultSettings(reqId, inputKind) {
	var data = {};
	data["inputKind"] = inputKind;
	sendObsCommand("GetInputDefaultSettings", data, reqId);
}

function GetInputSettings(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputSettings", data, reqId);
}

function SetInputSettings(reqId, inputName, inputSettings, overlay) {
	var data = {};
	data["inputName"] = inputName;
	data["inputSettings"] = inputSettings;
	data["overlay"] = overlay;
	sendObsCommand("SetInputSettings", data, reqId);
}

function GetInputMute(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputMute", data, reqId);
}

function SetInputMute(reqId, inputName, inputMuted) {
	var data = {};
	data["inputName"] = inputName;
	data["inputMuted"] = inputMuted;
	sendObsCommand("SetInputMute", data, reqId);
}

function ToggleInputMutee(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("ToggleInputMute", data, reqId);
}

function GetInputVolume(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputVolume", data, reqId);
}

function SetInputVolume(reqId, inputName, Dbsettings, inputVolumeMul, inputVolumeDb) {
	var data = {};
	data["inputName"] = inputName;
	
	if (Dbsettings == false ) {
		data["inputVolumeMul"] = inputVolumeMul;
	}
	else if (Dbsettings == true) {
		data["inputVolumeDb"] = inputVolumeDb;
	}
	sendObsCommand("SetInputVolume", data, reqId);
}

function GetInputAudioBalance(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputAudioBalance", data, reqId);
}

function SetInputAudioBalance(reqId, inputName, inputAudioBalance) {
	var data = {};
	data["inputName"] = inputName;
	data["inputAudioBalance"] = inputAudioBalance;
	sendObsCommand("SetInputAudioBalance", data, reqId);
}

function GetInputAudioSyncOffset(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputAudioSyncOffset", data, reqId);
}

function SetInputAudioSyncOffset(reqId, inputName, inputAudioSyncOffset) {
	var data = {};
	data["inputName"] = inputName;
	data["inputAudioSyncOffset"] = inputAudioSyncOffset;
	sendObsCommand("SetInputAudioSyncOffset", data, reqId);
}

function GetInputAudioMonitorType(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputAudioMonitorType", data, reqId);
}

function SetInputAudioMonitorType(reqId, inputName, monitorType) {
	var data = {};
	data["inputName"] = inputName;
	data["monitorType"] = monitorType;
	sendObsCommand("SetInputAudioMonitorType", data, reqId);
}

function GetInputAudioTracks(reqId, inputName) {
	var data = {};
	data["inputName"] = inputName;
	sendObsCommand("GetInputAudioTracks", data, reqId);
}

function SetInputAudioTracks(reqId, inputName, inputAudioTracks) {
	var data = {};
	data["inputName"] = inputName;
	data["inputAudioTracks"] = inputAudioTracks;
	sendObsCommand("SetInputAudioTracks", data, reqId);
}

function GetInputPropertiesListPropertyItems(reqId, inputName, propertyName) {
	var data = {};
	data["inputName"] = inputName;
	data["propertyName"] = propertyName;
	sendObsCommand("GetInputPropertiesListPropertyItems", data, reqId);
}

function PressInputPropertiesButton(reqId, inputName, propertyName) {
	var data = {};
	data["inputName"] = inputName;
	data["propertyName"] = propertyName;
	sendObsCommand("PressInputPropertiesButton", data, reqId);
}

//---------------------------------------------------------------------------------
/*Transitions Requests menu*/
function GetTransitionKindList(reqId, transitionKinds) {
	var data = {};
	data["transitionKinds"] = transitionKinds;
	sendObsCommand("GetTransitionKindList", data, reqId);
}

function GetSceneTransitionList(reqId, currentSceneTransitionName, currentSceneTransitionKind, transitions) {
	var data = {};
	data["currentSceneTransitionName"] = currentSceneTransitionName;
	data["currentSceneTransitionKind"] = currentSceneTransitionKind;
	data["transitions"] = transitions;
	sendObsCommand("GetSceneTransitionList", data, reqId);
}

function GetCurrentSceneTransition(reqId, transitionName, transitionKind, transitionFixed, transitionDuration, transitionConfigurable, transitionSettings) {
	var data = {};
	data["transitionName"] = transitionName;
	data["transitionKind"] = transitionKind;
	data["transitionFixed"] = transitionFixed;
	data["transitionDuration"] = transitionDuration;
	data["transitionConfigurable"] = transitionConfigurable;
	data["transitionSettings"] = transitionSettings;
	sendObsCommand("GetCurrentSceneTransition", data, reqId);
}

function SetCurrentSceneTransition(reqId, transitionName) {
	var data = {};
	data["transitionName"] = transitionName;
	sendObsCommand("SetCurrentSceneTransition", data, reqId);
}

function SetCurrentSceneTransitionDuration(reqId, transitionDuration) {
	var data = {};
	data["transitionDuration"] = transitionDuration;
	sendObsCommand("SetCurrentSceneTransitionDuration", data, reqId);
}

function SetCurrentSceneTransitionSettings(reqId, transitionSettings, overlay) {
	var data = {};
	data["transitionSettings"] = transitionSettings;
	data["overlay"] = overlay;
	sendObsCommand("SetCurrentSceneTransitionSettings", data, reqId);
}

function GetCurrentSceneTransitionCursor(reqId, transitionCursor) {
	var data = {};
	data["transitionCursor"] = transitionCursor;
	sendObsCommand("GetCurrentSceneTransitionCursor", data, reqId);
}

function TriggerStudioModeTransition(reqId) {
	var data = {};
	sendObsCommand("TriggerStudioModeTransition", data, reqId);
}

function SetTBarPosition(reqId, position, release) {
	var data = {};
	data["position"] = position;
	data["release"] = release;
	sendObsCommand("SetTBarPosition", data, reqId);
}

























/*Scene Items Requests Menu*/
function GetSceneItemList(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("GetSceneItemList", data, reqId);
}

function GetGroupSceneItemList(reqId, sceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	sendObsCommand("GetGroupSceneItemList", data, reqId);
}

function GetSceneItemId(reqId, sceneName, sourceName, searchOffset) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sourceName"] = sourceName;
	data["searchOffset"] = searchOffset;
	sendObsCommand("GetSceneItemId", data, reqId);
}

function CreateSceneItem(reqId, sceneName, sourceName, sceneItemEnabled) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sourceName"] = sourceName;
	data["sceneItemEnabled"] = sceneItemEnabled;
	sendObsCommand("CreateSceneItem", data, reqId);
}

function RemoveSceneItem(reqId, sceneName, sceneItemId) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	sendObsCommand("RemoveSceneItem", data, reqId);
}

function DuplicateSceneItem(reqId, sceneName, destinationSceneName) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneId"] = sceneId;
	data["destinationSceneName"] = destinationSceneName;
	sendObsCommand("DuplicateSceneItem", data, reqId);
}

function GetSceneItemTransform(reqId, sceneName, sceneItemId) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	sendObsCommand("GetSceneItemTransform", data, reqId);
}

function SetSceneItemTransform(reqId, sceneName, sceneItemId,sceneItemTransform) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	data["sceneItemTransform"] = sceneItemTransform;
	sendObsCommand("SetSceneItemTransform", data, reqId);
}

function GetSceneItemEnabled(reqId, sceneName, sceneItemId) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	sendObsCommand("GetSceneItemEnabled", data, reqId);
}

function SetSceneItemEnabled(reqId, sceneName, sceneItemId,sceneItemEnabled) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	data["sceneItemEnabled"] = sceneItemEnabled;
	sendObsCommand("SetSceneItemEnabled", data, reqId);
}

function GetSceneItemLocked(reqId, sceneName, sceneItemId) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	sendObsCommand("GetSceneItemLocked", data, reqId);
}

function SetSceneItemLocked(reqId, sceneName, sceneItemId,sceneItemLocked) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	data["sceneItemLocked"] = sceneItemLocked;
	sendObsCommand("SetSceneItemLocked", data, reqId);
}

function GetSceneItemIndex(reqId, sceneName, sceneItemId) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	sendObsCommand("GetSceneItemIndex", data, reqId);
}

function SetSceneItemIndex(reqId, sceneName, sceneItemId,sceneItemIndex) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	data["sceneItemIndex"] = sceneItemIndex;
	sendObsCommand("SetSceneItemIndex", data, reqId);
}

function GetSceneItemBlendMode(reqId, sceneName, sceneItemId) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	sendObsCommand("GetSceneItemBlendMode", data, reqId);
}

function SetSceneItemBlendMode(reqId, sceneName, sceneItemId,sceneItemBlendMode) {
	var data = {};
	data["sceneName"] = sceneName;
	data["sceneItemId"] = sceneItemId;
	data["sceneItemBlendMode"] = sceneItemBlendMode;
	sendObsCommand("SetSceneItemBlendMode", data, reqId);
}








