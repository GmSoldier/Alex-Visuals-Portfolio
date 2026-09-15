# Aleksandar Visuals — Editing Guide

This site intentionally uses only plain HTML, CSS and a small JavaScript image viewer.
There is no framework or build step.

## Main files

- `index.html` — homepage and project cards
- `styles.css` — all site styling
- `lightbox.js` — image zoom / pan viewer on project pages
- `projects/` — one HTML page per project
- `projects/_project-template.html` — duplicate this when adding a new project
- `assets/projects/` — project images

## Add a new project

### 1. Add the images

Create:

```text
assets/projects/my-project/
```

Recommended names:

```text
final.png
reference.png
test-01.png
test-02.png
composition.png
```

You only need the files that the project actually uses.

### 2. Create the project page

Duplicate:

```text
projects/_project-template.html
```

Rename it, for example:

```text
projects/my-product.html
```

Replace the placeholder text and image paths.

### 3. Add the project to the homepage

Open `index.html`.

Find:

```html
<!-- ADD NEW PROJECT CARD ABOVE THIS LINE -->
```

Copy one existing `<a class="project-card"> ... </a>` block and paste it above that line.

Change:

- project page link
- final image path
- category
- project name
- short description

## Change the final image size on every project page

Open `styles.css`.

At the top you will see:

```css
--final-image-width: 760px;
```

Change only that number.

Examples:

```css
--final-image-width: 700px;
--final-image-width: 820px;
```

The image zoom viewer will still open the full image when clicked.

## Fictional / concept-project disclosure

The homepage contains this note:

> All brands and projects shown below are fictional concept brands created for portfolio practice and creative exploration. They are not commissioned client work.

Each project page also says:

> Fictional concept brand · Portfolio project

## Image viewer

`lightbox.js` is shared by every project page.

You normally do not need to edit it.

It automatically makes images inside the project `<main>` clickable.
