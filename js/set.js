$(document).ready(function () {
    var vars = getUrlVars();
    if (typeof vars['domain'] !== 'undefined') {
        $('#domain').val(vars['domain']);
    }

    var proxy = localStorage['proxy'];
    $('#proxy').val(proxy);

    $('#set').click(function () {
        var proxy = $('#proxy').val();

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
    CodeMirror.fromTextArea(document.getElementById("proxy"), {
        lineNumbers: true,
        smartIndent: false,
        electricChars: false
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
        if (arr.length >= 2) {
            if (arr[1].substr(0, 1) == '.')
                pac += '    if (dnsDomainIs(host, "' + arr[1] + '"))' + "\n";
            else
                pac += '    if (host == "' + arr[1] + '")' + "\n";
            pac += '        return "PROXY ' + arr[0] + '";' + "\n";
        }
    });

    pac += '    return "DIRECT";' + "\n";
    pac += '}';

    console.log(pac);

    return pac;
}

