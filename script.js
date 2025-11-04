function calculate() {
    const ip = document.getElementById("ip").value.trim();
    const mask = document.getElementById("mask").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const ipPattern = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;
    if (!ipPattern.test(ip)) {
        resultDiv.innerHTML = "<p style='color:red'>Invalid IP address</p>";
        return;
    }

    // Convert subnet mask to CIDR
    let cidr = 0;
    if (mask.includes("/")) {
        cidr = parseInt(mask.replace("/", ""));
    } else if (ipPattern.test(mask)) {
        const maskBin = mask.split(".").map(o => parseInt(o).toString(2).padStart(8, "0")).join("");
        cidr = maskBin.split("1").length - 1;
    } else {
        resultDiv.innerHTML = "<p style='color:red'>Invalid subnet mask</p>";
        return;
    }

    if (cidr < 1 || cidr > 32) {
        resultDiv.innerHTML = "<p style='color:red'>CIDR must be between 1 and 32</p>";
        return;
    }

    const ipBin = ip.split(".").map(o => parseInt(o).toString(2).padStart(8, "0")).join("");
    const networkBin = ipBin.substring(0, cidr).padEnd(32, "0");
    const broadcastBin = ipBin.substring(0, cidr).padEnd(32, "1");

    const network = binToIP(networkBin);
    const broadcast = binToIP(broadcastBin);
    const totalHosts = Math.pow(2, 32 - cidr) - 2;
    const firstHost = binToIP((BigInt("0b"+networkBin)+1n).toString(2).padStart(32,"0"));
    const lastHost = binToIP((BigInt("0b"+broadcastBin)-1n).toString(2).padStart(32,"0"));

    resultDiv.innerHTML = `
        <p><strong>Network Address:</strong> ${network}</p>
        <p><strong>Broadcast Address:</strong> ${broadcast}</p>
        <p><strong>Usable Hosts:</strong> ${totalHosts}</p>
        <p><strong>Host Range:</strong> ${firstHost} - ${lastHost}</p>
        <p><strong>CIDR:</strong> /${cidr}</p>
    `;
}

function binToIP(bin) {
    return bin.match(/.{8}/g).map(b => parseInt(b,2)).join(".");
}
