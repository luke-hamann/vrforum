export function wrap(content) {
    return `
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
            <meta charset="utf-8" />
            <title>VR Forum</title>
            <script src="/js/aframe.min.js"></script>
        </head>
        <body>
            <a-scene>
                <a-entity
                    camera
                    look-controls="pointerLockEnabled: true;"
                    wasd-controls
                    position="0 1.6 0"
                    >
                </a-entity>
                ${content}
            </a-scene>
        </body>
        </html>
    `;
}
