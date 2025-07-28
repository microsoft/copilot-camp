# Card Component Demo

This page demonstrates how to use the `cc-card` web component.

## Individual Cards

### Basic Card
```html
<cc-card 
    title="Getting Started" 
    description="Learn the basics of AI prompting and get started with your first copilot instructions."
    href="/pages/copilot-instructions/getting-started">
</cc-card>
```

<cc-card 
    title="Getting Started" 
    description="Learn the basics of AI prompting and get started with your first copilot instructions."
    href="/pages/copilot-instructions/getting-started">
</cc-card>

### Card with Image
```html
<cc-card 
    title="Advanced Techniques" 
    description="Master advanced prompting techniques and learn to create sophisticated AI agents."
    href="/pages/copilot-instructions/advanced"
    image="/assets/images/advanced-techniques.png">
</cc-card>
```

<cc-card 
    title="Advanced Techniques" 
    description="Master advanced prompting techniques and learn to create sophisticated AI agents."
    href="/pages/copilot-instructions/advanced"
    image="/assets/images/advanced-techniques.png">
</cc-card>

### Card with External Link
```html
<cc-card 
    title="GitHub Repository" 
    description="Explore the source code and contribute to the Copilot Camp project."
    href="https://github.com/microsoft/copilot-camp"
    target="_blank">
</cc-card>
```

<cc-card 
    title="GitHub Repository" 
    description="Explore the source code and contribute to the Copilot Camp project."
    href="https://github.com/microsoft/copilot-camp"
    target="_blank">
</cc-card>

## Card Grid

Use the `cc-card-grid` component to create a responsive grid of cards:

```html
<cc-card-grid columns="3" gap="1.5rem">
    <cc-card 
        title="Fundamentals" 
        description="Start with the basics of AI prompting."
        href="/fundamentals">
    </cc-card>
    <cc-card 
        title="Best Practices" 
        description="Learn industry best practices for AI development."
        href="/best-practices">
    </cc-card>
    <cc-card 
        title="Advanced Topics" 
        description="Dive deep into advanced AI concepts."
        href="/advanced">
    </cc-card>
</cc-card-grid>
```

<cc-card-grid columns="3" gap="1.5rem">
    <cc-card 
        title="Fundamentals" 
        description="Start with the basics of AI prompting."
        href="/fundamentals">
    </cc-card>
    <cc-card 
        title="Best Practices" 
        description="Learn industry best practices for AI development."
        href="/best-practices">
    </cc-card>
    <cc-card 
        title="Advanced Topics" 
        description="Dive deep into advanced AI concepts."
        href="/advanced">
    </cc-card>
</cc-card-grid>

## Auto-fit Grid

The grid automatically adjusts to fit the available space:

```html
<cc-card-grid gap="1rem">
    <cc-card title="Card 1" description="This is the first card" href="#1"></cc-card>
    <cc-card title="Card 2" description="This is the second card" href="#2"></cc-card>
    <cc-card title="Card 3" description="This is the third card" href="#3"></cc-card>
    <cc-card title="Card 4" description="This is the fourth card" href="#4"></cc-card>
    <cc-card title="Card 5" description="This is the fifth card" href="#5"></cc-card>
</cc-card-grid>
```

<cc-card-grid gap="1rem">
    <cc-card title="Card 1" description="This is the first card" href="#1"></cc-card>
    <cc-card title="Card 2" description="This is the second card" href="#2"></cc-card>
    <cc-card title="Card 3" description="This is the third card" href="#3"></cc-card>
    <cc-card title="Card 4" description="This is the fourth card" href="#4"></cc-card>
    <cc-card title="Card 5" description="This is the fifth card" href="#5"></cc-card>
</cc-card-grid>

## Component Attributes

### cc-card

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `title` | string | The card title | "Card Title" |
| `description` | string | The card description | "Card description" |
| `href` | string | The link destination | "#" |
| `image` | string | Optional image URL | none |
| `target` | string | Link target (_blank, _self, etc.) | "_self" |
| `class` | string | Additional CSS classes | "" |

### cc-card-grid

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `columns` | number | Number of columns | auto-fit |
| `gap` | string | Grid gap (CSS units) | "1rem" |

## JavaScript API

You can also update cards dynamically:

```javascript
// Get a card element
const card = document.querySelector('cc-card');

// Update its properties
card.updateCard({
    title: 'New Title',
    description: 'New description',
    href: '/new-url',
    image: '/new-image.png'
});
```

## Features

- **Responsive**: Cards automatically adjust to different screen sizes
- **Accessible**: Full keyboard navigation and screen reader support
- **Customizable**: Support for images, external links, and custom styling
- **Interactive**: Hover effects and visual feedback
- **Grid Layout**: Flexible grid system for organizing multiple cards
- **Dark Mode**: Automatic dark mode support

<script src="/javascripts/cc-card.js"></script>
