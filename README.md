# QKart

- **QKart Website:** [QKart](https://qkart-frontend-rose.vercel.app/)
- **Backend API URL:** [QKart Backend](https://qkart-frontend-bup8.onrender.com/)

## Overview
QKart is an E-commerce application offering a variety of products for customers to choose from.

During this project:
- Implemented the core logic for authentication, shopping cart, and checkout.
- Improved UI by adding responsive design elements for a uniform experience across different devices.
- Utilized REST APIs to dynamically load and render data served by the backend server.
- Deployed website to Netlify/Vercel.

## QKart Component Architecture
![QKart Component Architecture](https://github.com/RutikKulkarni/QKart/assets/86470947/79950052-bd2c-46a4-b789-0f9a0a21b676)

## QKart Shopping Interface (Products page)
![QKart Shopping Interface](https://github.com/RutikKulkarni/QKart/assets/86470947/b8a57475-0655-4e18-931a-1bb468e6e8ac)


## Deploy the QKart Website
### Scope of work
- Deployed the QKart React app to Netlify.
- Configured Netlify to support visiting any subpages directly as React is a single page application.
### Skills used
Deployment, Netlify

## Add shopping cart and implement checkout flow
### Scope of work
- Added Cart to Products page and made it responsive.
- Made authenticated POST API calls to implement Cart logic.
- Rendered Cart with differing designs in Products page and Checkout page using conditional rendering.
- Implemented UI and logic to add and select new addresses.
### Skills used
Responsive Design, Reusable Components

![Products page UI with responsive Cart design (Left: Desktop, Right: Mobile)](https://github.com/RutikKulkarni/QKart/assets/86470947/1834709b-748b-40ed-a80b-34053f52ffd0)
![QKart Checkout page](https://github.com/RutikKulkarni/QKart/assets/86470947/d8fdb9ae-6003-437a-87de-e9cd2b8460cc)

## Display products and implement search feature
### Scope of work
- Utilized the `useEffect()` hook to fetch products data after DOM is rendered for faster page loading.
- Added a search bar to display only on the Products page’s header and implemented search logic.
- Implemented debouncing for improved UX and reduced API calls on search.
### Skills used
Keyword Search, Debouncing, Material UI Grid

![QKart Products page](https://github.com/RutikKulkarni/QKart/assets/86470947/efa8d835-4a65-4a67-b69d-497bd294e971)


## Implement registration-login flow and set up routing
### Scope of work
- Used React Router library to set up routes in the application and redirect customers to appropriate pages.
- Added UI and logic to get the Login page ready.
- Stored user information at the client side using localStorage to avoid login on revisit.
### Skills used
React Router, Material UI, localStorage, Controlled Components, Conditional Rendering

![Request-response cycle for QKart User signup and login](https://github.com/RutikKulkarni/QKart/assets/86470947/36ed288e-ad18-4a31-bd50-f508cc8b2c39)
![User flow on the website for signup and login](https://github.com/RutikKulkarni/QKart/assets/86470947/e63a7c5d-4c0c-4c49-89a2-00bde00e2e84)


## Add Registration feature
### Scope of work
- Implemented logic and used the backend API to get the registration feature ready.
- Added validation for the register form user input values to display informative error messages.
### Skills used
React.js, Event Handling, Forms, React Hooks, REST API, Error Handling
