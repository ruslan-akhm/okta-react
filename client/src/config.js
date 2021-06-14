const oktaAuthConfig = {
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
