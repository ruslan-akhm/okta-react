const oktaAuthConfig = {
  // Note: If your app is configured to use the Implicit flow
  // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
  // you will need to add `pkce: false`
  issuer: "https://dev-41008785.okta.com/oauth2/default",
  clientId: "0oaz88fmkLJKWgbGX5d6",
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "profile", "email"],
};

const oktaSignInConfig = {
  baseUrl: "https://dev-41008785.okta.com/",
  clientId: "0oaz88fmkLJKWgbGX5d6",
  redirectUri: window.location.origin + "/login/callback",
  authParams: {
    issuer: "https://dev-41008785.okta.com/oauth2/default",
    scopes: ["openid", "profile", "email"],
    responseType: "id_token",
  },
};

export { oktaAuthConfig, oktaSignInConfig };
