exports.clientIP = function(ipAddress, headers, callback){
	var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
	forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	return callback(ipAddress);
}