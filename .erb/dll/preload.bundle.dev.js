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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsT0FBMEMsRUFBRSxFQUFFLENBQ2hHLHNCQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUN4RCxTQUFTLEVBQUUsQ0FBQyxRQUE2QyxFQUFFLEVBQUUsQ0FDM0Qsc0JBQVcsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ25FLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL21xdHQtY2xpZW50L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9tcXR0LWNsaWVudC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9tcXR0LWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tcXR0LWNsaWVudC8uL3NyYy9tYWluL3ByZWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGV4aXN0cyAoZGV2ZWxvcG1lbnQgb25seSlcblx0aWYgKF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdID09PSB1bmRlZmluZWQpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHR5cGUge1xuICBNcXR0Q29ubmVjdGlvblByb2ZpbGUsXG4gIE1xdHRUZXN0UmVzdWx0LFxufSBmcm9tICcuLi9yZW5kZXJlci92aWV3cy9TZXR0aW5ncy9zdWJ2aWV3cy90eXBlcyc7XG5cbnR5cGUgTXF0dFByb2ZpbGVzTWFwID0gUmVjb3JkPHN0cmluZywgTXF0dENvbm5lY3Rpb25Qcm9maWxlPjtcblxuZXhwb3J0IGludGVyZmFjZSBNcXR0U2V0dGluZ3NBUEkge1xuICAvLyBQcm9maWxlc1xuICBnZXRNcXR0UHJvZmlsZXM6ICgpID0+IFByb21pc2U8UmVjb3JkPHN0cmluZywgTXF0dENvbm5lY3Rpb25Qcm9maWxlPj47XG4gIHVwc2VydE1xdHRQcm9maWxlOiAocHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVNcXR0UHJvZmlsZTogKHByb2ZpbGVJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICB0ZXN0TXF0dENvbm5lY3Rpb246IChcbiAgICBwcm9maWxlOiBNcXR0Q29ubmVjdGlvblByb2ZpbGUsXG4gICkgPT4gUHJvbWlzZTxNcXR0VGVzdFJlc3VsdD47XG5cbiAgLy8gUGFzc3dvcmRzIChzZWN1cmUgdmlhIGtleXRhciBpbiBtYWluIHByb2Nlc3MpXG4gIHNldE1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBnZXRNcXR0UGFzc3dvcmQ6IChwcm9maWxlSWQ6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmcgfCBudWxsPjtcbiAgZGVsZXRlTXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uQVBJJywge1xuICB3cml0ZUZpbGVBdG9taWM6IChmaWxlUGF0aDogc3RyaW5nLCBkYXRhOiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCd3cml0ZS1maWxlLWF0b21pYycsIGZpbGVQYXRoLCBkYXRhKSxcbn0pO1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdzZXR0aW5nc0FQSScsIHtcbiAgLy8gLS0tIE1RVFQgUHJvZmlsZXMgLS0tXG4gIGdldE1xdHRQcm9maWxlczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OmdldFByb2ZpbGVzJyksXG4gIHVwc2VydE1xdHRQcm9maWxlOiAocHJvZmlsZTogTXF0dENvbm5lY3Rpb25Qcm9maWxlKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDp1cHNlcnRQcm9maWxlJywgcHJvZmlsZSksXG4gIGRlbGV0ZU1xdHRQcm9maWxlOiAocHJvZmlsZUlkOiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OmRlbGV0ZVByb2ZpbGUnLCBwcm9maWxlSWQpLFxuICB0ZXN0TXF0dENvbm5lY3Rpb246IChwcm9maWxlOiBNcXR0Q29ubmVjdGlvblByb2ZpbGUpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OnRlc3RDb25uZWN0aW9uJywgcHJvZmlsZSksXG5cbiAgbXF0dENvbm5lY3Q6IChwcm9maWxlOiBNcXR0Q29ubmVjdGlvblByb2ZpbGUpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OmNvbm5lY3QnLCBwcm9maWxlKSxcblxuICAvLyAtLS0gU2VjdXJlIFBhc3N3b3JkcyAtLS1cbiAgc2V0TXF0dFBhc3N3b3JkOiAocHJvZmlsZUlkOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdtcXR0OnNldFBhc3N3b3JkJywgcHJvZmlsZUlkLCBwYXNzd29yZCksXG4gIGdldE1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpnZXRQYXNzd29yZCcsIHByb2ZpbGVJZCksXG4gIGRlbGV0ZU1xdHRQYXNzd29yZDogKHByb2ZpbGVJZDogc3RyaW5nKSA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dDpkZWxldGVQYXNzd29yZCcsIHByb2ZpbGVJZCksXG59IGFzIE1xdHRTZXR0aW5nc0FQSSk7XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2ZpbGVBUEknLCB7XG4gIG9wZW5GaWxlOiAob3B0aW9uczogRWxlY3Ryb24uT3BlbkRpYWxvZ09wdGlvbnMpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+ID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdmaWxlOm9wZW4nLCBvcHRpb25zKSxcbn0pO1xuXG5pcGNSZW5kZXJlci5zZW5kU3luYygnaXBjLXJlYWR5LWNoZWNrJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTXF0dEFQSSB7XG4gIGNvbm5lY3Q6IChvcHRpb25zOiB7IHVybDogc3RyaW5nOyB1c2VybmFtZT86IHN0cmluZzsgcGFzc3dvcmQ/OiBzdHJpbmcgfSkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICBkaXNjb25uZWN0OiAoKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIHN1YnNjcmliZTogKHRvcGljOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgdW5zdWJzY3JpYmU6ICh0b3BpYzogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gIHB1Ymxpc2g6ICh0b3BpYzogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPjtcbiAgb25NZXNzYWdlOiAoY2FsbGJhY2s6IChkYXRhOiB7IHRvcGljOiBzdHJpbmc7IG1lc3NhZ2U6IHN0cmluZyB9KSA9PiB2b2lkKSA9PiB2b2lkO1xufVxuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdtcXR0QVBJJywge1xuICBjb25uZWN0OiAob3B0aW9uczogUGFyYW1ldGVyczxNcXR0QVBJWydjb25uZWN0J10+WzBdKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvY29ubmVjdCcsIG9wdGlvbnMpLFxuICBkaXNjb25uZWN0OiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvZGlzY29ubmVjdCcpLFxuICBzdWJzY3JpYmU6ICh0b3BpYzogUGFyYW1ldGVyczxNcXR0QVBJWydzdWJzY3JpYmUnXT5bMF0pID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dC9zdWJzY3JpYmUnLCB0b3BpYyksXG4gIHVuc3Vic2NyaWJlOiAodG9waWM6IFBhcmFtZXRlcnM8TXF0dEFQSVsndW5zdWJzY3JpYmUnXT5bMF0pID0+IGlwY1JlbmRlcmVyLmludm9rZSgnbXF0dC91bnN1YnNjcmliZScsIHRvcGljKSxcbiAgcHVibGlzaDogKHRvcGljOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ3B1Ymxpc2gnXT5bMF0sIG1lc3NhZ2U6IFBhcmFtZXRlcnM8TXF0dEFQSVsncHVibGlzaCddPlsxXSkgPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ21xdHQvcHVibGlzaCcsIHsgdG9waWMsIG1lc3NhZ2UgfSksXG4gIG9uTWVzc2FnZTogKGNhbGxiYWNrOiBQYXJhbWV0ZXJzPE1xdHRBUElbJ29uTWVzc2FnZSddPlswXSkgPT5cbiAgICBpcGNSZW5kZXJlci5vbignbXF0dC9tZXNzYWdlJywgKF9ldmVudCwgZGF0YSkgPT4gY2FsbGJhY2soZGF0YSkpLFxufSk7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9