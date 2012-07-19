CodeMirror.defineMode("hosts", function (config, parserConfig) {
    function tokenHosts(stream, state) {
        var ch = stream.next();
        if (ch == '#') {
            stream.skipToEnd();
            return "comment";
        }
    }
    return {
        startState: function () {
            return {
                tokens: []
            }
        },
        token: function (stream, state) {
            if (stream.eatSpace()) {
                return null;
            }
            return tokenHosts(stream, state);
        }
    };
});
