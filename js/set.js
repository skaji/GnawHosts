$(document).ready(function () {
    var vars = getUrlVars();
    if (typeof vars['domain'] !== 'undefined') {
        $('#domain').val(vars['domain']);
    }

    var proxy = localStorage['proxy'];
    myCodeMirror.setValue(proxy);

    $('#set').click(function () {
        var proxy = myCodeMirror.getValue();

        localStorage['proxy'] = proxy;

        var pac = hosts2pac(proxy);

        var config = {
            mode: "pac_script",
            pacScript: {
                data: pac
            }
        };
        chrome.proxy.settings.set({
            value: config, 
            scope: 'regular'
        }, function() {});

        alert('OK');
    });
});

function hosts2pac(hosts) {
    hosts = hosts.replace("\r\n", "\n");

    var pac;
    pac = 'function FindProxyForURL(url, host) {' + "\n";

    var lines = hosts.split("\n");
    lines.forEach(function(line){
        line = line.replace(/#.*/, '');

        var arr = line.split(/[\s\t]+/);

        if (arr.length < 2)
            return;

        var cond = '';
        for (var i = 1; i < arr.length; i++) {
            if (i > 1)
                cond += ' || ';
            if (arr[i].substr(0, 1) == '.')
                cond += 'dnsDomainIs(host, "' + arr[i] + '")';
            else
                cond += 'host == "' + arr[i] + '"';
        }
        pac += '    if (' + cond + ') ' + "\n";
        pac += '        return "PROXY ' + arr[0] + '";' + "\n";
    });

    pac += '    return "DIRECT";' + "\n";
    pac += '}';

    console.log(pac);

    return pac;
}

