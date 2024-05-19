// ==UserScript==
// @name         increase sky.tcu.edu.tw watched time 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send a time logging request after the page loads.
// @author       James Huang
// @match        https://sky.tcu.edu.tw/media/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to get query parameters from URL
    function getQueryParams(url) {
        const params = {};
        const parser = new URL(url, window.location.origin);
        parser.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    // Function to extract logID and ajaxAuth from the script
    function extractParams() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const text = script.textContent;
            const logIDMatch = text.match(/logID=(\d+)/);
            const ajaxAuthMatch = text.match(/ajaxAuth=([a-z0-9]+)/);
            if (logIDMatch && ajaxAuthMatch) {
                return {
                    logID: logIDMatch[1],
                    ajaxAuth: ajaxAuthMatch[1]
                };
            }
        }
        return null;
    }

    // Generate a random time between 900 and 1500. The time unit here is seconds.

    function getRandomTime() {
        return Math.floor(Math.random() * (1500 - 900 + 1)) + 900;
    }

    // Function to send the request
    function sendRequest(params) {
        const time = getRandomTime();
        const url = `https://sky.tcu.edu.tw/ajax/sys.pages.media/watchTime/?logID=${params.logID}&timing=videoplaying&_lock=logID%2Ctiming&ajaxAuth=${params.ajaxAuth}&t=${time}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                alert('Request sent successfully: ' + JSON.stringify(data));
            })
            .catch(error => {
                alert('Error sending request: ' + error);
            });
    }

    // Wait for the window to load completely
    window.addEventListener('load', function() {
        const params = extractParams();
        if (params) {
            sendRequest(params);
        } else {
            alert('Failed to extract logID or ajaxAuth');
        }
    });
})();
