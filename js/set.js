$(document).ready(function () {
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

        $('#information')
        .addClass('alert-success')
        .text('Success (See details in console)')
        .show();

        console.log("The specified pac_script is:");
        console.log(pac);
        console.log("The currently effective proxy settings are:");
        chrome.proxy.settings.get(
            {'incognito': false},
            function (config) {
                console.log(config);
            }
        );
    });
});

function hosts2pac(hosts) {
    hosts = hosts.replace("\r\n", "\n");

    var pac;
    pac = 'function FindProxyForURL(url, host) {' + "\n";

    var lines = hosts.split("\n");
    lines.forEach(function (line) {
        line = line.replace(/#.*/, '');
        line = line.replace(/\s+$/, '');

        var arr = line.split(/\s+/);
        if (arr.length < 2) {
            return;
        }

        pac += '    if (';
        var conditions = [];
        for (var i = 1; i < arr.length; i += 1) {
            if (arr[i].substr(0, 1) == '.') {
                conditions.push('dnsDomainIs(host, "' + arr[i] + '")');
            }
            else {
                conditions.push('host == "' + arr[i] + '"');
            }
        }
        pac += conditions.join(' || ');
        pac += ")\n";
        pac += '        return "PROXY ' + arr[0] + '";' + "\n";
    });

    pac += '    return "DIRECT";' + "\n";
    pac += '}';

    return pac;
}

