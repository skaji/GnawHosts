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
            pac += '    if (host == "' + arr[1] + '")' + "\n";
            pac += '        return "PROXY ' + arr[0] + '";' + "\n";
        }
    });

    pac += '    return "DIRECT";' + "\n";
    pac += '}';

    return pac;
}

