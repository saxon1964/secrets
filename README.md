# What is ***My Secrets***

  It's an application to store unlimited number of your secrets (passwords, credit cards, IDs, personal data, secret notes in one place. It's fast and simple and works well even on small mobile phones. You can try it and use it, forever and for free, at [https://secrets.luka.in.rs](https://secrets.luka.in.rs)

# Benefits of [***My Secrets***](https://secrets.luka.in.rs)

  - Your secrets are fully encrypted. Not a single byte of it is left unencrypted in the main database.
  - Application supports password, credit cards, secret notes, ID documents and personal information.
  - Unencrypted data is never transmitted over the wire.
  - Your secrets are encrypted using your master password on your own (client) machine.
  - Your master password is not stored anywhere. If it is forgotten, all your secrets are also forgotten.
  - However, we can check if your master password is valid by trying to decrypt some random text that was created during master password creation phase
  - Encryption of all secrets is performed with [Standford Javascrpit Crypto Library](https://github.com/bitwiseshiftleft/sjcl/)
  - According to Stanford: SJCL is secure. It uses the industry-standard AES algorithm at 128, 192 or 256 bits; the SHA256 hash function; the HMAC authentication code; the PBKDF2 password strengthener; and the CCM and OCB authenticated-encryption modes. Just as importantly, the default parameters are sensible: SJCL strengthens your passwords by a factor of 1000 and salts them to protect against rainbow tables, and it authenticates every message it sends to prevent it from being modified. We believe that SJCL provides the best security which is practically available in Javascript.
  - The site uses https:// as a protocol of choice.
  - This application is and will always be free.

# Technology

  Frontent is created in React. Backend (server side scripts) are written in PHP. Data gets stored in a MariaDB.

# Wanna see something interesting

  I am an avid movie collector. Please check my movie collection called **Cinema Circle 2** at [https://www.luka.in.rs](https://www.luka.in.rs). Catalog software is 100% mine with frontend developed in VUE. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
