/*
 * ---------------------------------
 * DollarDollar
 * Author: Mohamad Jahani @Baarande @FictionTeam
 * Mon 29 Sep 2014 01:35:56 AM IRST
 * ---------------------------------
 */

var DollarDollar, $$;

(function() {

    "use strict";

    /**
     * -----------------------------
     * Polyfills
     * Most of them are here for "IE8".
     * -----------------------------
     */

    // No Polyfills for now! :)

    /**
     * DollarDollar
     */

    window.DollarDollar = window.$$ = function(selector) {
        return new DollarDollar(selector);
    };


    /**
     * Selector
     * @param {string|array} selector Selector string or an array of elements
     * return {object} selected arrays
     */
    DollarDollar = function(selector) {
        var nodes;
        if (typeof selector === 'string') {
            //var classPattern = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]$/;
            var classPattern = /^(?:\s*(<[\w\W]+>)[^>]*|\.([\w-]*))$/;
            //var idPattern = /\#-?[_a-zA-Z]+[_a-zA-Z0-9-]$/;
            var idPattern = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
            if (classPattern.test(selector) && document.getElementsByClassName) {
                nodes = document.getElementsByClassName(selector.slice(1));
            } else if (idPattern.test(selector)) {
                nodes = [];
                nodes.push(document.getElementById(selector.slice(1)));
            }
            else {
                nodes = document.querySelectorAll(selector);
            }
            this.query = selector;
        } else if (typeof selector === 'object') {
            nodes = selector.length ? selector : [selector];
        } else {
        	return new $$.ready(selector);
        }
        for (var i = 0; i < nodes.length; i++) {
            this[i] = nodes[i];
        }
        this.length = nodes.length;
    };

    DollarDollar.fn = DollarDollar.prototype = {
        VERSION: '0.0.3',
        isLatest: function() {
            return true;
        },
        each: function(fn) {
            for (var i = 0, len = this.length; i < len; i++) {
                fn.apply(this[i], [i, this[i]]);
            }
            return this;
        },
        html: function(val) {
            if (val === undefined) {
                return this[this.length - 1].innerHTML;
            } else {
                this.each(function() {
                    this.innerHTML = val;
                });
                return this;
            }
        },
        attr: function(prop, val) {
            if (val === undefined) {
                return this[this.length - 1].getAttribute(prop);
            } else {
                this.each(function() {
                    this.setAttribute(prop, val);
                });
                return this;
            }
        },
        after: function(val) {
            this.each(function() {
                this.insertAdjacentHTML('afterend', val);
            });
            return this;
        },
        before: function(val) {
            this.each(function() {
                this.insertAdjacentHTML('beforebegin', val);
            });
            return this;
        },
        append: function(val) {
            this.each(function() {
                this.innerHTML += val;
            });
            return this;
        },
        hide: function() {
            this.each(function() {
                this.style.display = 'none';
            });
            return this;
        },
        show: function() {
            this.each(function() {
                this.style.display = '';
            });
            return this;
        },
        rm: function() {
            this.each(function() {
                this.parentNode.removeChild(this);
            });
            return this;
        },
        first: function() {
            return new $$(this[0]);
        },
        last: function() {
            return new $$(this[this.length - 1]);
        },
        at: function(index) {
            return new $$(this[index]);
        },
        par: function() {
            return new $$(this[this.length - 1].parentNode);
        },
        addCls: function(className) {
            if (this.classList) {
                this.each(function() {
                    this.classList.add(className);
                });
            } else {
                this.each(function() {
                    this.className = this.className.length ? this.className + ' ' + className : className;
                });
            }
            return this;
        },
        rmCls: function(className) {
            if (this.classList) {
                this.each(function() {
                    this.classList.remove(className);
                });
            } else {
                this.each(function() {
                    this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), '');
                });
            }
            return this;
        },
        hasCls: function(className) {
            if (this.classList) {
                return this[this.length - 1].classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(this[this.length - 1].className);
            }
        },
        css: function(prop, val) {
            if (val === undefined) {
                return this[this.length - 1].style[prop];
            } else {
                this.each(function() {
                    this.style[prop] = val;
                });
                return this;
            }
        },
        on: function(ev, fn) {
            this.each(function() {
                this.addEventListener(ev, fn, false);
            });
            return this;
        },
        off: function(ev, fn) {
            this.each(function() {
                this.removeEventListener(ev, fn, false);
            });
            return this;
        },
        click: function(fn) {
            this.each(function() {
                this.addEventListener('click', fn);
            });
            return this;
        }
    };


    /**
     * Add main functions which can be used without selectors.
     * They can be used like $$.functionName (or DollarDollar.functionName)
     */
    var fns = {
        VERSION: DollarDollar.fn.VERSION,

        load: function(fn) {
            window.addEventListener('load', fn, false);
            return window;
        },

        ready: function(fn) {
            document.addEventListener('DOMContentLoaded', fn, false);
            return document;
        },

        each: function(ar, fn) {
            return new $$(ar).each(fn);
        },

        ajax: function(options) {
            var request = new XMLHttpRequest();
            //options.type = options.type || 'GET';
            request.open(options.type || 'GET', options.url, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    if (options.success) {
                        options.success.apply(this, [request.responseText]);
                    }
                } else {
                    if (options.error) {
                        options.error.apply(this, [request.statusText]);
                    }
                }
            };

            request.onerror = function() {
                if (options.error) {
                    options.error.apply(this, [request.statusText]);
                }
            };
            if (options.type === "POST") {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                request.send(options.data || "");
            } else {
                request.send();
            }

            return request;
        },

        on: function(el, ev, fn) {
            return new $$(el).on(ev, fn);
        },

        /**
         * Unbind events from element[s]
         * @param  {array|string}   el Element[s] to remove event
         * @param  {string}   ev Event name to remove
         * @param  {function} fn Function to remove
         * @return {object}      Selected elements
         */
        off: function(el, ev, fn) {
            return new $$(el).off(ev, fn);
        },

        /**
         * Execute a function after a specified time
         * @param  {number}   ms  Time to wait in milliseconds
         * @param  {function} fn  Function to execute after specified time
         * @return {number}       timerId
         */
        wait: function(ms, fn) {
            return window.setTimeout(fn, ms);
        },

        /**
         * Clear wait timer
         * @param  {number} id timerId
         * @return {number}    timerId
         */
        rmWait: function(id) {
            window.clearInterval(id);
            return id;
        },


    };

    for (var fn in fns) {
        $$[fn] = DollarDollar[fn] = fns[fn];
    }

    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return DollarDollar;
        });
    }


})();

