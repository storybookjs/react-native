var mock = function () {
    var storage = {};
    return {
        getItem: function (key) { return (key in storage ? storage[key] : null); },
        setItem: function (key, value) { return (storage[key] = value || ''); },
        removeItem: function (key) { return delete storage[key]; },
        clear: function () { return (storage = {}); },
    };
};
Object.defineProperty(window, 'localStorage', {
    value: mock(),
});
Object.defineProperty(window, 'sessionStorage', {
    value: mock(),
});
Object.defineProperty(window, 'getComputedStyle', {
    value: function () { return ['-webkit-appearance']; },
});
