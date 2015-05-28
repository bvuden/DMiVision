using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using System;
using System.Threading.Tasks;

namespace DMi.BridgeToVnext.Attributes
{
	public class ResourceAuthorizeAttribute : AuthorizationFilterAttribute
	{
		private string _action;
		private string[] _resources;

		public ResourceAuthorizeAttribute()
		{ }

		public ResourceAuthorizeAttribute(string action, params string[] resources)
		{
			_action = action;
			_resources = resources;
		}

		public override async Task OnAuthorizationAsync(AuthorizationContext context)
		{
			bool hasAccess = false;
			if (!string.IsNullOrWhiteSpace(_action))
			{
				hasAccess = CheckAccess(context.HttpContext, _action, _resources);
			}
			else
			{
				var controller = context.RouteData.Values["controller"] as string;
				var action = context.RouteData.Values["action"] as string;

				hasAccess = CheckAccess(context.HttpContext, action, controller);
			}

			if (!context.HttpContext.User.Identity.IsAuthenticated)
			{
				//context.HttpContext.Response.Challenge();
				Fail(context); //source for Fail method in AuthorizationFilterAttribute: context.Result = new HttpStatusCodeResult(401);
				return;
			}
			if (!hasAccess)
			{				
				context.Result = new HttpStatusCodeResult(403);
				return;
			}
		}

		protected override void Fail(AuthorizationContext context)
		{
			base.Fail(context);
		}

		//protected override bool AuthorizeCore(HttpContextBase httpContext)
		//{
		//	if (!string.IsNullOrWhiteSpace(_action))
		//	{
		//		return CheckAccess(httpContext, _action, _resources);
		//	}
		//	else
		//	{
		//		var controller = httpContext.Request.RequestContext.RouteData.Values["controller"] as string;
		//		var action = httpContext.Request.RequestContext.RouteData.Values["action"] as string;

		//		return CheckAccess(httpContext, action, controller);
		//	}
		//}

		protected virtual bool CheckAccess(HttpContext httpContext, string action, params string[] resources)
		{
			var task = httpContext.CheckAccessAsync(action, resources);

			if (task.Wait(5000))
			{
				return task.Result;
			}
			else
			{
				throw new TimeoutException();
			}
		}
	}


	//public class ClaimsAuthorizationAttribute : AuthorizationFilterAttribute
	//{
	//	public string ClaimType { get; set; }
	//	public string ClaimValue { get; set; }

	//	public override Task OnAuthorizationAsync(AuthorizationContext actionContext)
	//	{

	//		var principal = actionContext.HttpContext.User;

	//		if (!principal.Identity.IsAuthenticated)
	//		{
	//			actionContext.HttpContext.SetFeature<HttpResponse>(new HttpResponse = actionContext.HttpContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
	//			return Task.FromResult<object>(null);
	//		}

	//		if (!(principal.HasClaim(x => x.Type == ClaimType && x.Value == ClaimValue)))
	//		{
	//			actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
	//			return Task.FromResult<object>(null);
	//		}

	//		//User is Authorized, complete execution
	//		return Task.FromResult<object>(null);

	//	}
	//}



}