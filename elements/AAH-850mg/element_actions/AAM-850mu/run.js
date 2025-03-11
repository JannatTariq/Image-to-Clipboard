function(instance, properties, context) {
    let url = properties.image_url;

    if (!url.includes('https://') && !url.includes('http://')) {
        url = `https:${url}`;
    }

    async function copySVG() {
        if (!navigator.clipboard || !window.ClipboardItem) {
            console.warn("Clipboard API not supported in this browser.");
            return;
        }

        try {
            const response = await fetch(url, {
                mode: 'cors',
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.statusText}`);
            }

            const svgBlob = await response.blob();

            const svgText = await svgBlob.text();

            instance.publishState('svg_code', svgText);

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/svg+xml': svgBlob })
            ]);

            instance.triggerEvent('copied');
        } catch (error) {
            console.error("Error copying SVG:", error.message);
            alert(`Error: ${error.message}`);
        }
    }

    copySVG();
}
