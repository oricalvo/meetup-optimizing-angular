let host = "http://localhost:3000";
let http;

export function config({host: h, http: ht}) {
    host = h;
    http = ht;
}

export function reportCounter({name, value}) {
    http.post(host + "/api/counter",
        {name, value},
    ).toPromise();
}

export function reportCounters(counters) {
    for(const c of counters) {
        reportCounter(c);
    }
}

export function trackComponents(appRef, ngZone) {
    ngZone.runOutsideAngular(function() {
        setInterval(function() {
            const stats = {
                componentCount: 0,
                bindingCount: 0,
            };

            scanNodes(appRef._views["0"]._view.nodes, stats);

            http.post("http://localhost:3000/api/counter", [
                {name: "components", value: stats.componentCount},
                {name: "binding", value: stats.bindingCount},
            ]).toPromise();
        }, 1000);
    });
}

export function trackChangeDetection(appRef, ngZone) {
    let totalTick = 0;
    let countTick = 0;
    const originalTick = appRef.tick;

    appRef.tick = function() {
        const before = performance.now();

        originalTick.apply(this, arguments);

        const after = performance.now();

        const duration = (after - before);
        totalTick += duration;
        ++countTick;
        const avg = totalTick / countTick;

        ngZone.runOutsideAngular(function() {
            http.post("http://localhost:3000/api/counter", [
                {name: "cd (avg)", value: avg},
                {name: "cd (last)", value: duration},
                {name: "cd (count)", value: countTick},
            ]).toPromise();
        });
    }
}

function scanNodes(nodes, stats) {
    for(let i=0; i<nodes.length; i++) {
        const node = nodes[i];

        if(node.componentView && nodes[i+1].instance) {
            ++stats.componentCount;

            if(node.componentView.def.bindingCount > 0) {
                stats.bindingCount += node.componentView.def.bindingCount;
            }

            scanNodes(node.componentView.nodes, stats);
        }

        if(node.viewContainer && nodes[i+1].instance) {
            for(const embeddedView of node.viewContainer._embeddedViews) {
                if(embeddedView.def.bindingCount > 0) {
                    stats.bindingCount += embeddedView.def.bindingCount;
                }

                scanNodes(embeddedView.nodes, stats);
            }
        }
    }
}
