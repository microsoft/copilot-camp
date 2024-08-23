---8<--- "heading.md"

# Guide to formatting lab content

## Formatting text elements

These text elements are embedded into the lab instructions, so the formatting is always in-line

| Element | Treatment | Example |
|---|---|---|
| Function names | monospaced with parenthesis | Then, call `myFunction()` to do something ... |
| Language keywords | monospaced | ... insert at the top of the `try` block ... |
| Symbols in code (variable, object names etc.) | monospaced | ... the `foo` object contains something random ... |
| File and folder names | bold |  Copy the contents of **foo.js** into the **bar** folder |
| Text on screen | enclose in double quotes | Now click on the "foo" button |

## Includes

To include content from the /docs/includes folder, use this format:

--8<-- "test.md"

## Hyperlinks

Links within the labs can be relative and should open within the current window [like this](./labFormat.md).

Links that go outside the labs, including links to source code in the same repo, should open a new window [like this](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

Please add this query string to links to Microsoft documentation: ?WT.mc_id=m365-58890-cxa

## Admonitions

!!! check "Challenge"
    Here's something to try on your own

!!! note
    Use this format to emphasize or clarify the instructions

!!! tip
    Use this format to show tips and best practices

!!! warning
    Use this format to warn the student about a common pitfall in completing the labs

!!! danger
    Use this format to warn the student about security issues or stability issues that may arise in a production application

???+ info "Video briefing"
    <div class="video">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>Caption</div>
    </div>

???+ info "Video briefing"
    <div class="video">
      <img src="/app-camp/assets/video-coming-soon.png"></img>
      <div>Caption</div>
    </div>

???+ info "More information"
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>Caption 1</div>
    </div>
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>Caption 2</div>
    </div>
    <div class="tinyVideo">
      <img src="/app-camp/assets/video-coming-soon.png"></img>
      <div>Caption 3</div>
    </div>

??? info "TL;DR"
    Use this format to provide ancillary details that may be of interest but are not essential
