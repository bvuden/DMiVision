using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Thinktecture.IdentityModel;
using Thinktecture.IdentityModel.Owin.ResourceAuthorization;
using Microsoft.AspNet.Owin;

namespace Microsoft.AspNet.Http
{
	public static class HttpContextExtensions
	{
		public async static Task<bool> CheckAccessAsync(this HttpContext httpContext, string action, params string[] resources)
		{
			var cp = httpContext.User as ClaimsPrincipal;
			var authorizationContext = new ResourceAuthorizationContext(
				cp ?? Principal.Anonymous,
				action,
				resources);

			return await httpContext.CheckAccessAsync(authorizationContext);
		}

		public static async Task<bool> CheckAccessAsync(this HttpContext httpContext, ResourceAuthorizationContext authorizationContext)
		{
			IDictionary<string, object> env = new OwinEnvironment(httpContext);

            IResourceAuthorizationManager am = env[ResourceAuthorizationManagerMiddleware.Key] as IResourceAuthorizationManager;
			if (am == null)
			{
				throw new InvalidOperationException("No AuthorizationManager set.");
			}
			return await am.CheckAccessAsync(authorizationContext);
		}

		private static async Task<bool> CheckAccessAsync(this IOwinContext context, ResourceAuthorizationContext authorizationContext)
		{
			return await context.GetAuthorizationManager().CheckAccessAsync(authorizationContext);
		}

		private static IResourceAuthorizationManager GetAuthorizationManager(this IOwinContext context)
		{
			var am = context.Get<IResourceAuthorizationManager>(ResourceAuthorizationManagerMiddleware.Key);

			if (am == null)
			{
				throw new InvalidOperationException("No AuthorizationManager set.");
			}

			return am;
		}
	}
}