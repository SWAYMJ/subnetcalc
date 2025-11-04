function calculateSubnet() {
    const ipInput = document.getElementById("ipAddress").value.trim();
    const maskInput = document.getElementById("subnetMask").value.trim();
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    // Validate IP format
    const ipPattern = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    if (!ipPattern.test(ipInput)) {
        outputDiv.innerHTML = `<p style="color:red;">❌ Invalid IP address format.</p>`;
        return;
    }

    // Handle mask as CIDR or dotted decimal
    let cidr = 0;
    if (maskInput.includes("/")) {
        cidr = parseInt(maskInput.replace("/", ""));
    } else if (ipPattern.test(maskInput)) {
        const maskOctets = maskInput.split(".").map(o => parseInt(o));
        const maskBinary = maskOctets.map(o => o.toString(2).padStart(8, "0")).join("");
        cidr = maskBinary.split("1").length - 1;
    } else if (!isNaN(maskInput)) {
        cidr = parseInt(maskInput);
    } else {
        outputDiv.innerHTML = `<p style="color:red;">❌ Invalid subnet mask or CIDR.</p>`;
        return;
    }

    if (cidr < 1 || cidr > 32) {
        outputDiv.innerHTML = `<p style="color:red;">❌ CIDR must be between 1 and 32.</p>`;
        return;
    }

    // Convert IP to 32-bit binary
    const ipBinary = ipInput.split(".").map(o => parseInt(o).toString(2).padStart(8, "0")).join("");
    const networkBinary = ipBinary.substring(0, cidr).padEnd(32, "0");
    const broadcastBinary = ipBinary.substring(0, cidr).padEnd(32, "1");

    const networkIP = binaryToIP(networkBinary);
    const broadcastIP = binaryToIP(broadcastBinary);
    const totalHosts = Math.pow(2, 32 - cidr) - 2;

    const firstHost = binaryToIP((BigInt("0b" + networkBinary) + 1n).toString(2).padStart(32, "0"));
    const lastHost = binaryToIP((BigInt("0b" + broadcastBinary) - 1n).toString(2).padStart(32, "0"));

    outputDiv.innerHTML = `
        <div class="result">
            <p><strong>Network ID:</strong> ${networkIP}</p>
            <p><strong>Broadcast Address:</strong> ${broadcastIP}</p>
            <p><strong>First Host:</strong> ${firstHost}</p>
            <p><strong>Last Host:</strong> ${lastHost}</p>
            <p><strong>Total Hosts:</strong> ${totalHosts.toLocaleString()}</p>
            <p><strong>CIDR:</strong> /${cidr}</p>
        </div>
    `;
}

function binaryToIP(binaryStr) {
    return binaryStr.match(/.{8}/g).map(b => parseInt(b, 2)).join(".");
}
