function(properties, context) {
    async function copyImageToClipboard(imageSource) {
        try {
            const response = await fetch(imageSource, { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const blob = await response.blob();
            const img = new Image();

            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(async (pngBlob) => {
                    if (pngBlob) {
                        const item = new ClipboardItem({ 'image/png': pngBlob });
                        await navigator.clipboard.write([item]);
                    } else {
                        console.error('Failed to create PNG blob.');
                    }
                }, 'image/png');

                URL.revokeObjectURL(img.src);
            };

            img.onerror = (error) => console.error('Error loading image:', error);
            img.src = URL.createObjectURL(blob);

        } catch (err) {
            console.error('Error copying image:', err);
        }
    }

    async function copyBase64ImageToClipboard(base64String) {
        try {
            const byteCharacters = atob(base64String.split(',')[1]);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'image/png' });

            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);

        } catch (err) {
            console.error('Error copying Base64 image:', err);
        }
    }

    const parentElement = document.getElementById(properties.element_id);
    if (!parentElement) {
        console.error(`Element with ID '${properties.element_id}' not found.`);
        return;
    }

    const imgElement = parentElement.querySelector('img');
    if (!imgElement) {
        console.error('No image found inside the specified element.');
        return;
    }

    const imageSource = imgElement.src;

    if (imageSource.startsWith('data:image/')) {
        copyBase64ImageToClipboard(imageSource);
    } else {
        copyImageToClipboard(imageSource);
    }
}
