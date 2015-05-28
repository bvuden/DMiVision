using Microsoft.Owin;
using System;
using System.Linq;
using System.Threading.Tasks;
using Thinktecture.IdentityModel.Owin.ResourceAuthorization;

namespace DMi.Vision.Api.Helpers
{
    public class AuthorizationManager : ResourceAuthorizationManager
    {
        public override Task<bool> CheckAccessAsync(ResourceAuthorizationContext context)
        {
            var resource = context.Resource.First().Value;

            switch (resource)
            {
                case "Features":
                    return AuthorizeFeatures(context);
                default:
                    return Nok();
            }
        }

        private Task<bool> AuthorizeFeatures(ResourceAuthorizationContext context)
        {
            var action = context.Action.First().Value;

            switch (action)
            {
                case "Read":
                    // to be able to read this resourcegroup, the user must be in the WebReadUser role
                    return Eval(context.Principal.HasClaim("role", "WebReadUser"));
                case "Write":
                    // to be able to write to this resourcegroup, the user must be in the WebWriteUser role
                    return Eval(context.Principal.HasClaim("role", "WebWriteUser"));
                default:
                    return Nok();
            }
        }
    }
}