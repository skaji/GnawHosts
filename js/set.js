$(document).ready(function () {
    var vars = getUrlVars();
    if (typeof vars['domain'] !== 'undefined') {
        $('#domain').val(vars['domain']);
    }

	var proxy = localStorage['proxy'];
	if (proxy == undefined) {
		proxy = 'function FindProxyForURL(url, host) {' + "\n"
			+ '    return "DIRECT";' + "\n"
			+ '}' + "\n";
	}
    $('#proxy').val(proxy);

    $('#set').click(function () {
        var proxy = $('#proxy').val();

        var config = {
            mode: "pac_script",
            pacScript: {
                data: proxy
            }
        };
        chrome.proxy.settings.set({
            value: config, 
            scope: 'regular'
        }, function() {});

        localStorage['proxy'] = proxy;

        alert('OK');
    });
});

