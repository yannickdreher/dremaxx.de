function isArrayNullOrEmpty(arr) {
    return !arr || arr.length === 0;
}

export function buildMobileConfig(ssids, domains, enabledOnWifi, enabledOnCellular, prohibitDisablement) {
    const doc = document.implementation.createDocument(null, "plist", null);

    // Füge die Doctype-Deklaration hinzu
    const doctype = document.implementation.createDocumentType(
        "plist",
        "-//Apple//DTD PLIST 1.0//EN",
        "http://www.apple.com/DTDs/PropertyList-1.0.dtd"
    );
    doc.insertBefore(doctype, doc.documentElement);
    doc.documentElement.setAttribute("version", "1.0");

    const createElementWithText = (name, text) => {
        const element = doc.createElement(name);
        element.textContent = text;
        return element;
    };

    const dict = doc.createElement("dict");
    doc.documentElement.appendChild(dict);
    
    dict.appendChild(createElementWithText("key", "PayloadVersion"));
    dict.appendChild(createElementWithText("integer", "1"));
    
    dict.appendChild(createElementWithText("key", "PayloadDisplayName"));
    dict.appendChild(createElementWithText("string", "dremaxx encrypted DNS"));

    dict.appendChild(createElementWithText("key", "PayloadDescription"));
    dict.appendChild(
        createElementWithText(
            "string",
            "This profile enables dremaxx DNS servers on all networks using the native encrypted DNS feature."
        )
    );

    dict.appendChild(createElementWithText("key", "PayloadIdentifier"));
    dict.appendChild(createElementWithText("string", "dremaxx.dns.profile"));

    dict.appendChild(createElementWithText("key", "PayloadScope"));
    dict.appendChild(createElementWithText("string", "User"));

    dict.appendChild(createElementWithText("key", "PayloadType"));
    dict.appendChild(createElementWithText("string", "Configuration"));

    dict.appendChild(createElementWithText("key", "PayloadUUID"));
    dict.appendChild(
        createElementWithText("string", "f14a4bc1-534c-4bcb-97bc-f1f98e1c554a")
    );

    dict.appendChild(createElementWithText("key", "PayloadContent"));

    // PayloadContent -> Array
    const payloadContentArray = doc.createElement("array");
    dict.appendChild(payloadContentArray);

    // Array -> dict
    const payloadContentDict = doc.createElement("dict");
    payloadContentArray.appendChild(payloadContentDict);

    // DNSSettings
    payloadContentDict.appendChild(createElementWithText("key", "DNSSettings"));
    const dnsSettingsDict = doc.createElement("dict");
    payloadContentDict.appendChild(dnsSettingsDict);

    dnsSettingsDict.appendChild(createElementWithText("key", "DNSProtocol"));
    dnsSettingsDict.appendChild(createElementWithText("string", "TLS"));

    dnsSettingsDict.appendChild(createElementWithText("key", "ServerAddresses"));
    
    // ServerAddresses -> Array
    const serverAddressesArray = doc.createElement("array");
    dnsSettingsDict.appendChild(serverAddressesArray);
    
    serverAddressesArray.appendChild(createElementWithText("string", "85.215.153.54"));
    serverAddressesArray.appendChild(createElementWithText("string", "87.106.35.241"));
    serverAddressesArray.appendChild(createElementWithText("string", "2a01:239:251:a800::1"));
    serverAddressesArray.appendChild(createElementWithText("string", "2a00:da00:f425:5800::1"));

    dnsSettingsDict.appendChild(createElementWithText("key", "ServerName"));
    dnsSettingsDict.appendChild(createElementWithText("string", "dns.dremaxx.de"));
    
    // OnDemandRules
    payloadContentDict.appendChild(createElementWithText("key", "OnDemandRules"));
    const onDemandRulesArray = doc.createElement("array");
    payloadContentDict.appendChild(onDemandRulesArray);

    // Rule 1: Disconnect
    if (!isArrayNullOrEmpty(ssids)) {
        const rule1 = doc.createElement("dict");
        onDemandRulesArray.appendChild(rule1);

        rule1.appendChild(createElementWithText("key", "Action"));
        rule1.appendChild(createElementWithText("string", "Disconnect"));

        rule1.appendChild(createElementWithText("key", "SSIDMatch"));
        const ssidMatchArray = doc.createElement("array");
        rule1.appendChild(ssidMatchArray);
        
        ssids.forEach(ssid => {
            ssidMatchArray.appendChild(createElementWithText("string", ssid));
        });
    }
    
    // Rule 2: EvaluateConnection
    if (!isArrayNullOrEmpty(domains)) {
        const rule2 = doc.createElement("dict");
        onDemandRulesArray.appendChild(rule2);

        rule2.appendChild(createElementWithText("key", "Action"));
        rule2.appendChild(createElementWithText("string", "EvaluateConnection"));

        rule2.appendChild(createElementWithText("key", "ActionParameters"));
        const actionParametersArray = doc.createElement("array");
        rule2.appendChild(actionParametersArray);

        const actionParamDict = doc.createElement("dict");
        actionParametersArray.appendChild(actionParamDict);

        actionParamDict.appendChild(createElementWithText("key", "DomainAction"));
        actionParamDict.appendChild(createElementWithText("string", "NeverConnect"));

        actionParamDict.appendChild(createElementWithText("key", "Domains"));
        const domainsArray = doc.createElement("array");
        actionParamDict.appendChild(domainsArray);

        domains.forEach((domain) =>
            domainsArray.appendChild(createElementWithText("string", domain))
        );
    }
    
    // Rule 3: InterfaceTypeMatch -> WiFi
    if (enabledOnWifi) {
        const rule3 = doc.createElement("dict");
        onDemandRulesArray.appendChild(rule3);
        rule3.appendChild(createElementWithText("key", "Action"));
        rule3.appendChild(createElementWithText("string", "Connect"));
        rule3.appendChild(createElementWithText("key", "InterfaceTypeMatch"));
        rule3.appendChild(createElementWithText("string", "WiFi"));
    }
    
    // Rule 4: InterfaceTypeMatch -> Cellular
    if (enabledOnCellular) {
        const rule4 = doc.createElement("dict");
        onDemandRulesArray.appendChild(rule4);
        rule4.appendChild(createElementWithText("key", "Action"));
        rule4.appendChild(createElementWithText("string", "Connect"));
        rule4.appendChild(createElementWithText("key", "InterfaceTypeMatch"));
        rule4.appendChild(createElementWithText("string", "Cellular"));
    }
    
    // Rule 5: Connect
    const rule5 = doc.createElement("dict");
    onDemandRulesArray.appendChild(rule5);
    rule5.appendChild(createElementWithText("key", "Action"));
    rule5.appendChild(createElementWithText("string", "Disconnect"));

    // Weitere Payload-Felder hinzufügen
    payloadContentDict.appendChild(createElementWithText("key", "PayloadType"));
        payloadContentDict.appendChild(
        createElementWithText("string", "com.apple.dnsSettings.managed")
    );

    payloadContentDict.appendChild(createElementWithText("key", "PayloadIdentifier"));
    payloadContentDict.appendChild(
        createElementWithText(
            "string",
            "dremaxx.dns.profile.dnsSettings.managed"
        )
    );

    payloadContentDict.appendChild(createElementWithText("key", "PayloadUUID"));
    payloadContentDict.appendChild(
        createElementWithText(
            "string",
            "6a455f5b-4e2f-4214-b0f0-0a398fb607fc"
        )
    );

    payloadContentDict.appendChild(createElementWithText("key", "PayloadDisplayName"));
    payloadContentDict.appendChild(createElementWithText("string", "dremaxx encrypted DNS"));

    payloadContentDict.appendChild(createElementWithText("key", "PayloadOrganization"));
    payloadContentDict.appendChild(createElementWithText("string", "dremaxx"));

    payloadContentDict.appendChild(createElementWithText("key", "PayloadVersion"));
    payloadContentDict.appendChild(createElementWithText("integer", "1"));
    
    if (prohibitDisablement) {
        payloadContentDict.appendChild(createElementWithText("key", "ProhibitDisablement"));
        payloadContentDict.appendChild(doc.createElement("true"));
    }

    const serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(doc);
    xmlString = `<?xml version="1.0" encoding="UTF-8"?>` + xmlString;
    console.log(xmlString);
    
    return xmlString;
}