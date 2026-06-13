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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsRUFBRSxDQUNoRyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDeEQsU0FBUyxFQUFFLENBQUMsUUFBNkMsRUFBRSxFQUFFLENBQzNELHNCQUFXLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNuRSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tcXR0LWNsaWVudC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vbXF0dC1jbGllbnQvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vbXF0dC1jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXF0dC1jbGllbnQvLi9zcmMvbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBleGlzdHMgKGRldmVsb3BtZW50IG9ubHkpXG5cdGlmIChfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB0eXBlIHtcbiAgTXF0dENvbm5lY3Rpb25Qcm9maWxlLFxuICBNcXR0VGVzdFJlc3VsdCxcbn0gZnJvbSAnLi4vcmVuZGVyZXIvdmlld3MvU2V0dGluZ3Mvc3Vidmlld3MvdHlwZXMnO1xuXG50eXBlIE1xdHRQcm9maWxlc01hcCA9IFJlY29yZDxzdHJpbmcsIE1xdHRDb25uZWN0aW9uUHJvZmlsZT47XG5cbmV4cG9ydCBpbnRlcmZhY2UgTXF0dFNldHRpbmdzQVBJIHtcbiAgLy8gUHJvZmlsZXNcbiAgZ2V0TXF0dFByb2ZpbGVzOiAoKSA9PiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIE1xdHRDb25uZWN0aW9uUHJvZmlsZT4+O1xuICB1cHNlcnRNcXR0UHJvZmlsZTogKHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlTXF0dFByb2ZpbGU6IChwcm9maWxlSWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgdGVzdE1xdHRDb25uZWN0aW9uOiAoXG4gICAgcHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlLFxuICApID0+IFByb21pc2U8TXF0dFRlc3RSZXN1bHQ+O1xuXG4gIC8vIFBhc3N3b3JkcyAoc2VjdXJlIHZpYSBrZXl0YXIgaW4gbWFpbiBwcm9jZXNzKVxuICBzZXRNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZ2V0TXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nIHwgbnVsbD47XG4gIGRlbGV0ZU1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbkFQSScsIHtcbiAgd3JpdGVGaWxlQXRvbWljOiAoZmlsZVBhdGg6IHN0cmluZywgZGF0YTogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnd3JpdGUtZmlsZS1hdG9taWMnLCBmaWxlUGF0aCwgZGF0YSksXG59KTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnc2V0dGluZ3NBUEknLCB7XG4gIC8vIC0tLSBNUVRUIFByb2ZpbGVzIC0tLVxuICBnZXRNcXR0UHJvZmlsZXM6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpnZXRQcm9maWxlcycpLFxuICB1cHNlcnRNcXR0UHJvZmlsZTogKHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6dXBzZXJ0UHJvZmlsZScsIHByb2ZpbGUpLFxuICBkZWxldGVNcXR0UHJvZmlsZTogKHByb2ZpbGVJZDogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpkZWxldGVQcm9maWxlJywgcHJvZmlsZUlkKSxcbiAgdGVzdE1xdHRDb25uZWN0aW9uOiAocHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDp0ZXN0Q29ubmVjdGlvbicsIHByb2ZpbGUpLFxuXG4gIG1xdHRDb25uZWN0OiAocHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpjb25uZWN0JywgcHJvZmlsZSksXG5cbiAgLy8gLS0tIFNlY3VyZSBQYXNzd29yZHMgLS0tXG4gIHNldE1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpzZXRQYXNzd29yZCcsIHByb2ZpbGVJZCwgcGFzc3dvcmQpLFxuICBnZXRNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6Z2V0UGFzc3dvcmQnLCBwcm9maWxlSWQpLFxuICBkZWxldGVNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6ZGVsZXRlUGFzc3dvcmQnLCBwcm9maWxlSWQpLFxufSBhcyBNcXR0U2V0dGluZ3NBUEkpO1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdmaWxlQVBJJywge1xuICBvcGVuRmlsZTogKG9wdGlvbnM6IEVsZWN0cm9uLk9wZW5EaWFsb2dPcHRpb25zKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZmlsZTpvcGVuJywgb3B0aW9ucyksXG59KTtcblxuaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ2lwYy1yZWFkeS1jaGVjaycpO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1xdHRBUEkge1xuICBjb25uZWN0OiAob3B0aW9uczogeyB1cmw6IHN0cmluZzsgdXNlcm5hbWU/OiBzdHJpbmc7IHBhc3N3b3JkPzogc3RyaW5nIH0pID0+IFByb21pc2U8c3RyaW5nPjtcbiAgZGlzY29ubmVjdDogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBzdWJzY3JpYmU6ICh0b3BpYzogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIHVuc3Vic2NyaWJlOiAodG9waWM6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBwdWJsaXNoOiAodG9waWM6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIG9uTWVzc2FnZTogKGNhbGxiYWNrOiAoZGF0YTogeyB0b3BpYzogc3RyaW5nOyBtZXNzYWdlOiBzdHJpbmcgfSkgPT4gdm9pZCkgPT4gdm9pZDtcbn1cblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnbXF0dEFQSScsIHtcbiAgY29ubmVjdDogKG9wdGlvbnM6IFBhcmFtZXRlcnM8TXF0dEFQSVsnY29ubmVjdCddPlswXSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L2Nvbm5lY3QnLCBvcHRpb25zKSxcbiAgZGlzY29ubmVjdDogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L2Rpc2Nvbm5lY3QnKSxcbiAgc3Vic2NyaWJlOiAodG9waWM6IFBhcmFtZXRlcnM8TXF0dEFQSVsnc3Vic2NyaWJlJ10+WzBdKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvc3Vic2NyaWJlJywgdG9waWMpLFxuICB1bnN1YnNjcmliZTogKHRvcGljOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ3Vuc3Vic2NyaWJlJ10+WzBdKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvdW5zdWJzY3JpYmUnLCB0b3BpYyksXG4gIHB1Ymxpc2g6ICh0b3BpYzogUGFyYW1ldGVyczxNcXR0QVBJWydwdWJsaXNoJ10+WzBdLCBtZXNzYWdlOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ3B1Ymxpc2gnXT5bMV0pID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L3B1Ymxpc2gnLCB7IHRvcGljLCBtZXNzYWdlIH0pLFxuICBvbk1lc3NhZ2U6IChjYWxsYmFjazogUGFyYW1ldGVyczxNcXR0QVBJWydvbk1lc3NhZ2UnXT5bMF0pID0+XG4gICAgaXBjUmVuZGVyZXIub24oJ21xdHQvbWVzc2FnZScsIChfZXZlbnQsIGRhdGEpID0+IGNhbGxiYWNrKGRhdGEpKSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==