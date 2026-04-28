# Dobbaballapur Rents

This folder contains a React-based rental property listing website with:

- a public visitor experience
- a password-protected admin panel
- `localStorage` persistence for listings
- preloaded Dobbaballapur sample properties

## Run locally

Because the app loads a single JSX file in the browser, it is best to serve the folder with a local server:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Admin login

- Password: `admin123`

## Main files

- `index.html` - minimal HTML shell that loads React, Google Fonts, and the app
- `app.jsx` - the full site in one JSX file, including UI, styles, localStorage logic, sample data, and admin tools
