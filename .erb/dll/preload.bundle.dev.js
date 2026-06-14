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
electron_1.contextBridge.exposeInMainWorld('filesAPI', {
    writeFile: (relativeName, content) => electron_1.ipcRenderer.invoke('write-file', relativeName, content),
    readFile: (relativeName) => electron_1.ipcRenderer.invoke('read-file', relativeName),
    onFileChanged: (cb) => {
        const listener = (_evt, filename) => cb(filename);
        electron_1.ipcRenderer.on('file-changed', listener);
        return () => {
            electron_1.ipcRenderer.removeListener('file-changed', listener);
        };
    },
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVkEscUM7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQzVCQSxtRUFBc0Q7QUF1QnRELHdCQUFhLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFO0lBQzdDLGVBQWUsRUFBRSxDQUFDLFFBQWdCLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FDbEQsc0JBQVcsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQztDQUMxRCxDQUFDLENBQUM7QUFFSCx3QkFBYSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRTtJQUM3Qyx3QkFBd0I7SUFDeEIsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0lBQzdELGlCQUFpQixFQUFFLENBQUMsT0FBOEIsRUFBRSxFQUFFLENBQ3BELHNCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQztJQUNuRCxpQkFBaUIsRUFBRSxDQUFDLFNBQWlCLEVBQUUsRUFBRSxDQUN2QyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUM7SUFDckQsa0JBQWtCLEVBQUUsQ0FBQyxPQUE4QixFQUFFLEVBQUUsQ0FDckQsc0JBQVcsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDO0lBRXBELFdBQVcsRUFBRSxDQUFDLE9BQThCLEVBQUUsRUFBRSxDQUM5QyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO0lBRTdDLDJCQUEyQjtJQUMzQixlQUFlLEVBQUUsQ0FBQyxTQUFpQixFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUN2RCxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDO0lBQzdELGVBQWUsRUFBRSxDQUFDLFNBQWlCLEVBQUUsRUFBRSxDQUNyQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLENBQUM7SUFDbkQsa0JBQWtCLEVBQUUsQ0FBQyxTQUFpQixFQUFFLEVBQUUsQ0FDeEMsc0JBQVcsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDO0NBQ3BDLENBQUMsQ0FBQztBQUV0Qix3QkFBYSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtJQUN6QyxRQUFRLEVBQUUsQ0FBQyxPQUFtQyxFQUEwQixFQUFFLENBQ3hFLHNCQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7Q0FDM0MsQ0FBQyxDQUFDO0FBRUgsc0JBQVcsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQVd4Qyx3QkFBYSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtJQUN6QyxPQUFPLEVBQUUsQ0FBQyxPQUEwQyxFQUFFLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO0lBQ3BHLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUN2RCxTQUFTLEVBQUUsQ0FBQyxLQUEwQyxFQUFFLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUM7SUFDdEcsV0FBVyxFQUFFLENBQUMsS0FBNEMsRUFBRSxFQUFFLENBQUMsc0JBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDO0lBQzVHLE9BQU8sRUFBRSxDQUFDLEtBQXdDLEVBQUUsT0FBMEMsRUFBRSxFQUFFLENBQ2hHLHNCQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUN4RCxTQUFTLEVBQUUsQ0FBQyxRQUE2QyxFQUFFLEVBQUUsQ0FDM0Qsc0JBQVcsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ25FLENBQUMsQ0FBQztBQUVILHdCQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFO0lBQzFDLFNBQVMsRUFBRSxDQUFDLFlBQW9CLEVBQUUsT0FBZSxFQUFFLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQztJQUM3RyxRQUFRLEVBQUUsQ0FBQyxZQUFvQixFQUFFLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO0lBQ2pGLGFBQWEsRUFBRSxDQUFDLEVBQThCLEVBQUUsRUFBRTtRQUNoRCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVMsRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0Qsc0JBQVcsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sR0FBRyxFQUFFO1lBQ1Ysc0JBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tcXR0LWNsaWVudC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vbXF0dC1jbGllbnQvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vbXF0dC1jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXF0dC1jbGllbnQvLi9zcmMvbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBleGlzdHMgKGRldmVsb3BtZW50IG9ubHkpXG5cdGlmIChfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB0eXBlIHtcbiAgTXF0dENvbm5lY3Rpb25Qcm9maWxlLFxuICBNcXR0VGVzdFJlc3VsdCxcbn0gZnJvbSAnLi4vcmVuZGVyZXIvdmlld3MvU2V0dGluZ3Mvc3Vidmlld3MvdHlwZXMnO1xuXG50eXBlIE1xdHRQcm9maWxlc01hcCA9IFJlY29yZDxzdHJpbmcsIE1xdHRDb25uZWN0aW9uUHJvZmlsZT47XG5cbmV4cG9ydCBpbnRlcmZhY2UgTXF0dFNldHRpbmdzQVBJIHtcbiAgLy8gUHJvZmlsZXNcbiAgZ2V0TXF0dFByb2ZpbGVzOiAoKSA9PiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIE1xdHRDb25uZWN0aW9uUHJvZmlsZT4+O1xuICB1cHNlcnRNcXR0UHJvZmlsZTogKHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlTXF0dFByb2ZpbGU6IChwcm9maWxlSWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgdGVzdE1xdHRDb25uZWN0aW9uOiAoXG4gICAgcHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlLFxuICApID0+IFByb21pc2U8TXF0dFRlc3RSZXN1bHQ+O1xuXG4gIC8vIFBhc3N3b3JkcyAoc2VjdXJlIHZpYSBrZXl0YXIgaW4gbWFpbiBwcm9jZXNzKVxuICBzZXRNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZ2V0TXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nIHwgbnVsbD47XG4gIGRlbGV0ZU1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbkFQSScsIHtcbiAgd3JpdGVGaWxlQXRvbWljOiAoZmlsZVBhdGg6IHN0cmluZywgZGF0YTogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnd3JpdGUtZmlsZS1hdG9taWMnLCBmaWxlUGF0aCwgZGF0YSksXG59KTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnc2V0dGluZ3NBUEknLCB7XG4gIC8vIC0tLSBNUVRUIFByb2ZpbGVzIC0tLVxuICBnZXRNcXR0UHJvZmlsZXM6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpnZXRQcm9maWxlcycpLFxuICB1cHNlcnRNcXR0UHJvZmlsZTogKHByb2ZpbGU6IE1xdHRDb25uZWN0aW9uUHJvZmlsZSkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6dXBzZXJ0UHJvZmlsZScsIHByb2ZpbGUpLFxuICBkZWxldGVNcXR0UHJvZmlsZTogKHByb2ZpbGVJZDogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpkZWxldGVQcm9maWxlJywgcHJvZmlsZUlkKSxcbiAgdGVzdE1xdHRDb25uZWN0aW9uOiAocHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDp0ZXN0Q29ubmVjdGlvbicsIHByb2ZpbGUpLFxuXG4gIG1xdHRDb25uZWN0OiAocHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpjb25uZWN0JywgcHJvZmlsZSksXG5cbiAgLy8gLS0tIFNlY3VyZSBQYXNzd29yZHMgLS0tXG4gIHNldE1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpzZXRQYXNzd29yZCcsIHByb2ZpbGVJZCwgcGFzc3dvcmQpLFxuICBnZXRNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6Z2V0UGFzc3dvcmQnLCBwcm9maWxlSWQpLFxuICBkZWxldGVNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZykgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQ6ZGVsZXRlUGFzc3dvcmQnLCBwcm9maWxlSWQpLFxufSBhcyBNcXR0U2V0dGluZ3NBUEkpO1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdmaWxlQVBJJywge1xuICBvcGVuRmlsZTogKG9wdGlvbnM6IEVsZWN0cm9uLk9wZW5EaWFsb2dPcHRpb25zKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZmlsZTpvcGVuJywgb3B0aW9ucyksXG59KTtcblxuaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ2lwYy1yZWFkeS1jaGVjaycpO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1xdHRBUEkge1xuICBjb25uZWN0OiAob3B0aW9uczogeyB1cmw6IHN0cmluZzsgdXNlcm5hbWU/OiBzdHJpbmc7IHBhc3N3b3JkPzogc3RyaW5nIH0pID0+IFByb21pc2U8c3RyaW5nPjtcbiAgZGlzY29ubmVjdDogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBzdWJzY3JpYmU6ICh0b3BpYzogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIHVuc3Vic2NyaWJlOiAodG9waWM6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBwdWJsaXNoOiAodG9waWM6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIG9uTWVzc2FnZTogKGNhbGxiYWNrOiAoZGF0YTogeyB0b3BpYzogc3RyaW5nOyBtZXNzYWdlOiBzdHJpbmcgfSkgPT4gdm9pZCkgPT4gdm9pZDtcbn1cblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnbXF0dEFQSScsIHtcbiAgY29ubmVjdDogKG9wdGlvbnM6IFBhcmFtZXRlcnM8TXF0dEFQSVsnY29ubmVjdCddPlswXSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L2Nvbm5lY3QnLCBvcHRpb25zKSxcbiAgZGlzY29ubmVjdDogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L2Rpc2Nvbm5lY3QnKSxcbiAgc3Vic2NyaWJlOiAodG9waWM6IFBhcmFtZXRlcnM8TXF0dEFQSVsnc3Vic2NyaWJlJ10+WzBdKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvc3Vic2NyaWJlJywgdG9waWMpLFxuICB1bnN1YnNjcmliZTogKHRvcGljOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ3Vuc3Vic2NyaWJlJ10+WzBdKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvdW5zdWJzY3JpYmUnLCB0b3BpYyksXG4gIHB1Ymxpc2g6ICh0b3BpYzogUGFyYW1ldGVyczxNcXR0QVBJWydwdWJsaXNoJ10+WzBdLCBtZXNzYWdlOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ3B1Ymxpc2gnXT5bMV0pID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0L3B1Ymxpc2gnLCB7IHRvcGljLCBtZXNzYWdlIH0pLFxuICBvbk1lc3NhZ2U6IChjYWxsYmFjazogUGFyYW1ldGVyczxNcXR0QVBJWydvbk1lc3NhZ2UnXT5bMF0pID0+XG4gICAgaXBjUmVuZGVyZXIub24oJ21xdHQvbWVzc2FnZScsIChfZXZlbnQsIGRhdGEpID0+IGNhbGxiYWNrKGRhdGEpKSxcbn0pO1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdmaWxlc0FQSScsIHtcbiAgd3JpdGVGaWxlOiAocmVsYXRpdmVOYW1lOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCd3cml0ZS1maWxlJywgcmVsYXRpdmVOYW1lLCBjb250ZW50KSxcbiAgcmVhZEZpbGU6IChyZWxhdGl2ZU5hbWU6IHN0cmluZykgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdyZWFkLWZpbGUnLCByZWxhdGl2ZU5hbWUpLFxuICBvbkZpbGVDaGFuZ2VkOiAoY2I6IChmaWxlbmFtZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSAoX2V2dDogYW55LCBmaWxlbmFtZTogc3RyaW5nKSA9PiBjYihmaWxlbmFtZSk7XG4gICAgaXBjUmVuZGVyZXIub24oJ2ZpbGUtY2hhbmdlZCcsIGxpc3RlbmVyKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoJ2ZpbGUtY2hhbmdlZCcsIGxpc3RlbmVyKTtcbiAgICB9O1xuICB9LFxufSk7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9