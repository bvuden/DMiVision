known issues:
ASP.NET 5 beta4 CORS support is not fully functional for IE.
Access-Control-Allow-Headers shows as two separate headers which makes IE not process a cors response.
https://github.com/aspnet/CORS/issues/22
Should be fixed in beta6
