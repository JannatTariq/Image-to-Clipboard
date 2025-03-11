function(instance, properties, context) {
    function supportsSVG() {
        return (
            'ClipboardItem' in window &&
            window.ClipboardItem.supports &&
            window.ClipboardItem.supports('image/svg+xml')
        );
    }

    async function pasteAndUploadSVG() {
        if (!supportsSVG()) {
            console.warn("Clipboard does not support SVG format.");
            return;
        }

        try {
            const [clipboardItem] = await navigator.clipboard.read();
            const svgBlob = await clipboardItem.getType('image/svg+xml');

            if (!svgBlob) {
                console.warn('No SVG found in the clipboard.');
                return;
            }

            let svgCode = await svgBlob.text();

            const targetId = properties.target_element_id;
            if (!targetId) {
                console.warn("No target element ID provided.");
                return;
            }

            const targetElement = document.getElementById(targetId);
            if (!targetElement) {
                console.warn(`Element with ID '${targetId}' not found.`);
                return;
            }

            const targetWidth = targetElement.clientWidth || 100;
            const targetHeight = targetElement.clientHeight || 100;
            
            if(properties.upload_image_to_file_manager){
            
            const base64Data = btoa(unescape(encodeURIComponent(svgCode)));
            const base64URL = `data:image/svg+xml;base64,${base64Data}`;

            const fileName = `${properties.image_name}.svg` || "pasted-svg.svg";
            context.uploadContent(fileName, base64Data, function(err, url) {
                if (url) {
                    instance.publishState("svg_upload_url", url);
                } else {
                    console.warn("Failed to upload SVG to Bubble File Manager:", err);
                }
            });

            }
            svgCode = svgCode.replace(/<svg /, `<svg width="${targetWidth}" height="${targetHeight}" `);

            targetElement.innerHTML = svgCode;


            instance.publishState('svg_code', svgCode);
            instance.triggerEvent('pasted');

        } catch (error) {
            console.error("Error pasting and uploading SVG:", error);
        }
    }
    
    pasteAndUploadSVG();
}
