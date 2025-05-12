document.addEventListener("DOMContentLoaded", function () {
    // Get all code blocks on the page
    var codeBlocks = document.querySelectorAll("pre > code");

    codeBlocks.forEach(function (codeBlock) {
        // Create a copy button
        var button = document.createElement("button");
        button.className = "copy-button";
        button.type = "button";
        button.innerText = "Copy";

        // Add click event listener to the button
        button.addEventListener("click", function () {
            var text = codeBlock.innerText;
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);

            // Temporarily change the button text to "Copied!"
            button.innerText = "Copied!";
            setTimeout(function () {
                button.innerText = "Copy";
            }, 2000);
        });

        // Insert the button before the code block
        var pre = codeBlock.parentNode;
        pre.parentNode.insertBefore(button, pre);
    });
});
