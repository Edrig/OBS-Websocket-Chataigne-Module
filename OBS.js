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
function wsMessageReceived(message)
{
	script.log("Websocket data received : " +message);
	var obsObj = JSON.parse(message);
	if (obsObj.op == 0 && obsObj.d.authentication != null)
	{
		var mdp = "MonMDP" + obsObj.d.authentication.salt;
		//script.log("mdp = " + mdp);
		var Encode1 = util.toBase64(util.encodeSHA256(mdp));
		//script.log("Encode1 = " + Encode1);
		var Encode2 = util.toBase64(util.encodeSHA256(Encode1+obsObj.d.authentication.challenge));
		//script.log("Encode2 = " + Encode2);
		local.send('{   "op": 1,   "d": {     "rpcVersion": 1,     "authentication": "'+Encode2+'",     "eventSubscriptions": 33   } }');
		
	} 
	else if (obsObj.op == 0) 
	{
		local.send('{   "op": 1,   "d": {     "rpcVersion": 1,     "authentication": "test1",     "eventSubscriptions": 33   } }');
	}
}

function wsDataReceived(data)
{
	script.log("Websocket data received : " +data);
}

function sendObsCommand(req, data) {
	var send = {};
	var para = {};
	para["requestType"] = req;
	para["requestId"] = "prout";
	para["requestData"] = data;

/*!== undefined ? data : {}*/
	send["op"]=6;
	send["d"]=para;

	script.log(JSON.stringify(send));
	local.send(JSON.stringify(send)); 
}

function sendObsRawCommand(json)
{
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

function OBSSetVolume(source, vol) {
	var data = {};
	data["inputName"] = source;
	data["inputVolumeMul"] = vol;
	/*data["inputVolumeDb"] = 0;*/
	sendObsCommand("SetInputVolume", data);
}

function OBSSetVolumeDb(source, vol) {
	var data = {};
	data["inputName"] = source;
	data["inputVolumeDb"] = vol;
	sendObsCommand("SetInputVolume", data);
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
