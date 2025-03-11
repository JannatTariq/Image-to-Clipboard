function(properties, context) {
    async function copyImageToClipboard(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const blob = await response.blob();
            const mimeType = blob.type || 'image/png'; 
            
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(async (imageBlob) => {
                    if (imageBlob) {
                        const item = new ClipboardItem({ 'image/png': imageBlob });
                        await navigator.clipboard.write([item]);
                    } else {
                        console.error('Failed to create image blob.');
                    }
                }, 'image/png');
                
                URL.revokeObjectURL(img.src);
            };

            img.onerror = (error) => {
                console.error('Error loading image:', error);
            };

        } catch (err) {
            console.error('Error:', err);
        }
    }
    copyImageToClipboard(properties.url);
}
