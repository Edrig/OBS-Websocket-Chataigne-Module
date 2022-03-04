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

function dataReceived(data)
{
	//If mode is "Lines", you can expect data to be a single line String
	script.log("Data received : " +data);
	
	//If mode is anything else, you can expect data to be an array of bytes
	script.log("Bytes received : "+data.length);
	for(var i=0; i < data.length; i++)
	{
		script.log(" > " + data[i]);
	}
}

/* ********** STREAMING MODULE (UDP, TCP, SERIAL, WEBSOCKET) SPECIFIC SCRIPTING ********************* */
/*

Websoskets modules can be used as standard Streaming Module and use the dataReceived function above, 
but you can also intercept messages and data directly from the streaming, before it is processed, using specific 
event callbacks below
*/

function wsMessageReceived(message)
{
	script.log("Websocket data received : " +message);
}

function wsDataReceived(data)
{
	script.log("Websocket data received : " +data);
}

function sendObsCommand(req, data) {
	data = data !== undefined ? data : {};
	data["message-id"] = "Chataigne";
	data["request-type"] = req;

	script.log(JSON.stringify(data));
	local.send(JSON.stringify(data)); 
}

function sendObsRawCommand(json)
{
	local.send(json);
}

/*Error Bad request format*/
function OBSPlayMedia(source) {
	var data = {};
	data["sourceName"] = source;
	//data["playPause"] = "false";
	sendObsCommand("PlayPauseMedia", data);
}

/*Error Bad request format*/
function OBSPauseMedia(source) {
	var data = {};
	data["sourceName"] = source;
	//data["playPause"] = "true";
	sendObsCommand("PlayPauseMedia", data);
}

function OBSRestartMedia(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("RestartMedia", data);
}

function OBSStopMedia(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("StopMedia", data);
}

function OBSNextMedia(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("NextMedia", data);
}

function OBSPreviousMedia(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("PreviousMedia", data);
}

function OBSSetMediaTime(source, time) {
	var data = {};
	data["sourceName"] = source;
	data["timestamp"] = time;
	sendObsCommand("SetMediaTime", data);
}

function OBSGetMediaTime(source) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("GetMediaTime", data);
}

function OBSScrubMedia(source, time) {
	var data = {};
	data["sourceName"] = source;
	data["timeOffset"] = time;
	sendObsCommand("ScrubMedia", data);
}

function OBSSetVolume(source, vol) {
	var data = {};
	data["sourceName"] = source;
	data["volume"] = vol;
	data["useDecibel"] = false;
	sendObsCommand("SetVolume", data);
}

function OBSSetVolumeDb(source, vol) {
	var data = {};
	data["sourceName"] = source;
	data["volume"] = vol;
	data["useDecibel"] = true;
	sendObsCommand("SetVolume", data);
}

function OBSSetMute(source, val) {
	var data = {};
	data["sourceName"] = source;
	data["mute"] = val;
	sendObsCommand("SetMute", data);
}

function OBSToggleMute(source, val) {
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("ToggleMute", data);
}


function OBSTakeSourceScreenshot(source, format, path) { // "png", "jpg", "jpeg" or "bmp", 
	var data = {};
	data["sourceName"] = source;
	data["embedPictureFormat"] = format;
	data["saveToFilePath"] = path;
	sendObsCommand("TakeSourceScreenshot", data);
}

function OBSRefreshBrowserSource(source) { 
	var data = {};
	data["sourceName"] = source;
	sendObsCommand("RefreshBrowserSource", data);
}

function OBSSetCurrentProfile(name) { 
	var data = {};
	data["profile-name"] = name;
	sendObsCommand("SetCurrentProfile", data);
}

function OBSStartRecording() { 
	var data = {};
	sendObsCommand("StartRecording", data);
}

function OBSStopRecording() { 
	var data = {};
	sendObsCommand("StopRecording", data);
}

function OBSPauseRecording() { 
	var data = {};
	sendObsCommand("PauseRecording", data);
}

function OBSResumeRecording() { 
	var data = {};
	sendObsCommand("ResumeRecording", data);
}

function OBSSetCurrentSceneCollection(name) { 
	var data = {};
	data["sc-name"] = name;
	sendObsCommand("SetCurrentSceneCollection", data);
}

function OBSSetCurrentScene(name) { 
	var data = {};
	data["scene-name"] = name;
	sendObsCommand("SetCurrentScene", data);
}

function OBSSetSceneTransitionOverride(name, transitionName, transitionDuration) { 
	var data = {};
	data["scene-name"] = name;
	data["transitionName"] = transitionName;
	data["transitionDuration"] = transitionDuration;
	sendObsCommand("SetSceneTransitionOverride", data);
}

function OBSSetPreviewScene(name) { 
	var data = {};
	data["scene-name"] = name;
	sendObsCommand("SetPreviewScene", data);
}

function OBSSetCurrentTransition(name) { 
	var data = {};
	data["transition-name"] = name;
	sendObsCommand("SetCurrentTransition", data);
}

function OBSSetTransitionDuration(duration) { 
	var data = {};
	data["duration"] = duration;
	sendObsCommand("SetTransitionDuration", data);
}


