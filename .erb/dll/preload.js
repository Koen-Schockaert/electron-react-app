(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

module.exports = require("electron");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    writeFileAtomic: (filePath, data) => electron_1.ipcRenderer.invoke('write-file-atomic', filePath, data),
});
electron_1.contextBridge.exposeInMainWorld('settingsAPI', {
    // --- MQTT Profiles ---
    getMqttProfiles: () => electron_1.ipcRenderer.invoke('mqtt:getProfiles'),
    upsertMqttProfile: (profile) => electron_1.ipcRenderer.invoke('mqtt:upsertProfile', profile),
    deleteMqttProfile: (profileId) => electron_1.ipcRenderer.invoke('mqtt:deleteProfile', profileId),
    testMqttConnection: (profile) => electron_1.ipcRenderer.invoke('mqtt:testConnection', profile),
    mqttConnect: (profile) => electron_1.ipcRenderer.invoke('mqtt:connect', profile),
    // --- Secure Passwords ---
    setMqttPassword: (profileId, password) => electron_1.ipcRenderer.invoke('mqtt:setPassword', profileId, password),
    getMqttPassword: (profileId) => electron_1.ipcRenderer.invoke('mqtt:getPassword', profileId),
    deleteMqttPassword: (profileId) => electron_1.ipcRenderer.invoke('mqtt:deletePassword', profileId),
});
electron_1.contextBridge.exposeInMainWorld('fileAPI', {
    openFile: (options) => electron_1.ipcRenderer.invoke('file:open', options),
});
electron_1.ipcRenderer.sendSync('ipc-ready-check');
electron_1.contextBridge.exposeInMainWorld('mqttAPI', {
    connect: (options) => electron_1.ipcRenderer.invoke('mqtt/connect', options),
    disconnect: () => electron_1.ipcRenderer.invoke('mqtt/disconnect'),
    subscribe: (topic) => electron_1.ipcRenderer.invoke('mqtt/subscribe', topic),
    unsubscribe: (topic) => electron_1.ipcRenderer.invoke('mqtt/unsubscribe', topic),
    publish: (topic, message) => electron_1.ipcRenderer.invoke('mqtt/publish', { topic, message }),
    onMessage: (callback) => electron_1.ipcRenderer.on('mqtt/message', (_event, data) => callback(data)),
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsRUFBRSxDQUNoRyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDeEQsU0FBUyxFQUFFLENBQUMsUUFBNkMsRUFBRSxFQUFFLENBQzNELHNCQUFXLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNuRSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1hcHAvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2VsZWN0cm9uLXJlYWN0LWFwcC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZWxlY3Ryb24tcmVhY3QtYXBwLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDaGVjayBpZiBtb2R1bGUgZXhpc3RzIChkZXZlbG9wbWVudCBvbmx5KVxuXHRpZiAoX193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgdHlwZSB7XG4gIE1xdHRDb25uZWN0aW9uUHJvZmlsZSxcbiAgTXF0dFRlc3RSZXN1bHQsXG59IGZyb20gJy4uL3JlbmRlcmVyL3ZpZXdzL1NldHRpbmdzL3N1YnZpZXdzL3R5cGVzJztcblxudHlwZSBNcXR0UHJvZmlsZXNNYXAgPSBSZWNvcmQ8c3RyaW5nLCBNcXR0Q29ubmVjdGlvblByb2ZpbGU+O1xuXG5leHBvcnQgaW50ZXJmYWNlIE1xdHRTZXR0aW5nc0FQSSB7XG4gIC8vIFByb2ZpbGVzXG4gIGdldE1xdHRQcm9maWxlczogKCkgPT4gUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCBNcXR0Q29ubmVjdGlvblByb2ZpbGU+PjtcbiAgdXBzZXJ0TXF0dFByb2ZpbGU6IChwcm9maWxlOiBNcXR0Q29ubmVjdGlvblByb2ZpbGUpID0+IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZU1xdHRQcm9maWxlOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIHRlc3RNcXR0Q29ubmVjdGlvbjogKFxuICAgIHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSxcbiAgKSA9PiBQcm9taXNlPE1xdHRUZXN0UmVzdWx0PjtcblxuICAvLyBQYXNzd29yZHMgKHNlY3VyZSB2aWEga2V5dGFyIGluIG1haW4gcHJvY2VzcylcbiAgc2V0TXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG4gIGdldE1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZyB8IG51bGw+O1xuICBkZWxldGVNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb25BUEknLCB7XG4gIHdyaXRlRmlsZUF0b21pYzogKGZpbGVQYXRoOiBzdHJpbmcsIGRhdGE6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3dyaXRlLWZpbGUtYXRvbWljJywgZmlsZVBhdGgsIGRhdGEpLFxufSk7XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ3NldHRpbmdzQVBJJywge1xuICAvLyAtLS0gTVFUVCBQcm9maWxlcyAtLS1cbiAgZ2V0TXF0dFByb2ZpbGVzOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6Z2V0UHJvZmlsZXMnKSxcbiAgdXBzZXJ0TXF0dFByb2ZpbGU6IChwcm9maWxlOiBNcXR0Q29ubmVjdGlvblByb2ZpbGUpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OnVwc2VydFByb2ZpbGUnLCBwcm9maWxlKSxcbiAgZGVsZXRlTXF0dFByb2ZpbGU6IChwcm9maWxlSWQ6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6ZGVsZXRlUHJvZmlsZScsIHByb2ZpbGVJZCksXG4gIHRlc3RNcXR0Q29ubmVjdGlvbjogKHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6dGVzdENvbm5lY3Rpb24nLCBwcm9maWxlKSxcblxuICBtcXR0Q29ubmVjdDogKHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6Y29ubmVjdCcsIHByb2ZpbGUpLFxuXG4gIC8vIC0tLSBTZWN1cmUgUGFzc3dvcmRzIC0tLVxuICBzZXRNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6c2V0UGFzc3dvcmQnLCBwcm9maWxlSWQsIHBhc3N3b3JkKSxcbiAgZ2V0TXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OmdldFBhc3N3b3JkJywgcHJvZmlsZUlkKSxcbiAgZGVsZXRlTXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OmRlbGV0ZVBhc3N3b3JkJywgcHJvZmlsZUlkKSxcbn0gYXMgTXF0dFNldHRpbmdzQVBJKTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZmlsZUFQSScsIHtcbiAgb3BlbkZpbGU6IChvcHRpb25zOiBFbGVjdHJvbi5PcGVuRGlhbG9nT3B0aW9ucyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4gPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2ZpbGU6b3BlbicsIG9wdGlvbnMpLFxufSk7XG5cbmlwY1JlbmRlcmVyLnNlbmRTeW5jKCdpcGMtcmVhZHktY2hlY2snKTtcblxuZXhwb3J0IGludGVyZmFjZSBNcXR0QVBJIHtcbiAgY29ubmVjdDogKG9wdGlvbnM6IHsgdXJsOiBzdHJpbmc7IHVzZXJuYW1lPzogc3RyaW5nOyBwYXNzd29yZD86IHN0cmluZyB9KSA9PiBQcm9taXNlPHN0cmluZz47XG4gIGRpc2Nvbm5lY3Q6ICgpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgc3Vic2NyaWJlOiAodG9waWM6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICB1bnN1YnNjcmliZTogKHRvcGljOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgcHVibGlzaDogKHRvcGljOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBvbk1lc3NhZ2U6IChjYWxsYmFjazogKGRhdGE6IHsgdG9waWM6IHN0cmluZzsgbWVzc2FnZTogc3RyaW5nIH0pID0+IHZvaWQpID0+IHZvaWQ7XG59XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ21xdHRBUEknLCB7XG4gIGNvbm5lY3Q6IChvcHRpb25zOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ2Nvbm5lY3QnXT5bMF0pID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dC9jb25uZWN0Jywgb3B0aW9ucyksXG4gIGRpc2Nvbm5lY3Q6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dC9kaXNjb25uZWN0JyksXG4gIHN1YnNjcmliZTogKHRvcGljOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ3N1YnNjcmliZSddPlswXSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L3N1YnNjcmliZScsIHRvcGljKSxcbiAgdW5zdWJzY3JpYmU6ICh0b3BpYzogUGFyYW1ldGVyczxNcXR0QVBJWyd1bnN1YnNjcmliZSddPlswXSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L3Vuc3Vic2NyaWJlJywgdG9waWMpLFxuICBwdWJsaXNoOiAodG9waWM6IFBhcmFtZXRlcnM8TXF0dEFQSVsncHVibGlzaCddPlswXSwgbWVzc2FnZTogUGFyYW1ldGVyczxNcXR0QVBJWydwdWJsaXNoJ10+WzFdKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dC9wdWJsaXNoJywgeyB0b3BpYywgbWVzc2FnZSB9KSxcbiAgb25NZXNzYWdlOiAoY2FsbGJhY2s6IFBhcmFtZXRlcnM8TXF0dEFQSVsnb25NZXNzYWdlJ10+WzBdKSA9PlxuICAgIGlwY1JlbmRlcmVyLm9uKCdtcXR0L21lc3NhZ2UnLCAoX2V2ZW50LCBkYXRhKSA9PiBjYWxsYmFjayhkYXRhKSksXG59KTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=