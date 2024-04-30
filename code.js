"use strict";
figma.showUI(__html__, { width: 300, height: 400 });
figma.on('drop', (event) => {
    const { files, dropMetadata } = event;
    let selectedElement = figma.currentPage.selection;
    if (dropMetadata.type == "draggable") {
        if (files.length > 0 && files[0].type === 'image/svg+xml') {
            files[0].getTextAsync().then((text) => {
                const newNode = figma.createNodeFromSvg(text);
                figma.currentPage.appendChild(newNode);
                newNode.resize(512, 512);
                newNode.x = event.absoluteX;
                newNode.y = event.absoluteY;
                // newNode.x = figma.viewport.center.x;
                // newNode.y = figma.viewport.center.y;
                figma.currentPage.selection = [newNode];
            });
        }
    }
    else if (dropMetadata.type == "clickable") {
        if (selectedElement && selectedElement.length > 0) {
            selectedElement.forEach(node => {
                if (files.length > 0 && files[0].type === 'image/svg+xml') {
                    files[0].getTextAsync().then((text) => {
                        let newNode = figma.createNodeFromSvg(text);
                        newNode.resize(node.width, node.height);
                        newNode.x = node.x;
                        newNode.y = node.y;
                        if (node.type == "RECTANGLE") {
                            node.appendChild(newNode);
                        }
                        else {
                            node.parent.appendChild(newNode);
                            node.remove();
                        }
                        figma.currentPage.selection = [node];
                        figma.viewport.scrollAndZoomIntoView([node]);
                    });
                }
            });
            // const selectedArtboard = figma.currentPage.selection[0];
            // console.log("selectedArtboard",selectedArtboard);
            // console.log("Artboard Type", selectedArtboard.type);
            // if (files.length > 0 && files[0].type === 'image/svg+xml') {
            //   files[0].getTextAsync().then((text) => {
            //     const newNode = figma.createNodeFromSvg(text);
            //     console.log("newNode...",newNode);
            //     newNode.resize(selectedArtboard.width,selectedArtboard.height);
            //     newNode.x = selectedArtboard.x;
            //     newNode.y = selectedArtboard.y;
            //     if(selectedArtboard.type == "RECTANGLE"){
            //       selectedArtboard.appendChild(newNode);
            //     }
            //     else{
            //       selectedArtboard.appendChild(newNode);
            //     }
            //   figma.currentPage.selection = [selectedArtboard];
            //   figma.viewport.scrollAndZoomIntoView([selectedArtboard]);
            //   })
            // }
        }
        else {
            if (files.length > 0 && files[0].type === 'image/svg+xml') {
                files[0].getTextAsync().then((text) => {
                    const newNode = figma.createNodeFromSvg(text);
                    newNode.resize(512, 512);
                    newNode.x = figma.viewport.center.x;
                    newNode.y = figma.viewport.center.y;
                    figma.currentPage.selection = [newNode];
                });
            }
        }
    }
    return false;
});
figma.ui.onmessage = (msg) => {
    if (msg.type == "importFile") {
        const selectedNode = figma.currentPage.selection;
        console.log("selectedNode..", selectedNode);
        if (selectedNode && selectedNode.length > 0) {
            selectedNode.forEach(node => {
                console.log("Nodeeee", node);
                const container = figma.createFrame();
                container.layoutMode = "VERTICAL"; // Adjust layout mode as needed
                container.counterAxisSizingMode = "AUTO";
                container.primaryAxisSizingMode = "AUTO";
                container.x = 100; // Adjust position as needed
                container.y = 100;
                const svgData = node.exportAsync({ format: 'SVG' });
                const imageNode = figma.createImage(svgData);
                // imageNode.resize(300, 300);
                // imageNode.primaryAxisAlignItems = "CENTER";
                container.appendChild(imageNode);
                // Add the container to the plugin UI
                figma.currentPage.appendChild(container);
            });
        }
        // else{
        // }
    }
};
