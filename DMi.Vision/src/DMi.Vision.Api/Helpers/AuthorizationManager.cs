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
                    return AuthorizeFeaturesResource(context);
                case "Votes":
                    return AuthorizeVotesResource(context);
                case "Users":
                    return AuthorizeUsersResource(context);
                case "Status":
                    return AuthorizeStatusResource(context);
                default:
                    return Nok();
            }
        }

        private Task<bool> AuthorizeFeaturesResource(ResourceAuthorizationContext context)
        {
            var action = context.Action.First().Value;

            switch (action)
            {
                case "Read":
                    // to be able to read a feature request, the user must be in the DMiVisionUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                case "Write":
                    // to be able to write to a feature request, the user must be in the DMiVisionUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                case "Delete":
                    // to be able to delete from a feature request, the user must be in the DMiVisionAdmin role
                    return Eval(context.Principal.HasClaim("role","DMiVisionAdmin"));
                case "ChangeStatus":
                    // to be able to change the status for a feature request, the user must be in the DMiVisionAdmin role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionAdmin"));
                default:
                    return Nok();
            }
        }
        private Task<bool> AuthorizeVotesResource(ResourceAuthorizationContext context)
        {
            var action = context.Action.First().Value;

            switch (action)
            {
                case "Read":
                    // to be able to read this resourcegroup, the user must be in the WebReadUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                case "Write":
                    // to be able to write to this resourcegroup, the user must be in the WebWriteUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                default:
                    return Nok();
            }
        }
        private Task<bool> AuthorizeUsersResource(ResourceAuthorizationContext context)
        {
            var action = context.Action.First().Value;

            switch (action)
            {
                case "Read":
                    // to be able to read this resourcegroup, the user must be in the WebReadUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                case "Write":
                    // to be able to write to this resourcegroup, the user must be in the WebWriteUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                default:
                    return Nok();
            }
        }
        private Task<bool> AuthorizeStatusResource(ResourceAuthorizationContext context)
        {
            var action = context.Action.First().Value;

            switch (action)
            {
                case "Read":
                    // to be able to read this resourcegroup, the user must be in the WebReadUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionUser"));
                case "Write":
                    // to be able to write to this resourcegroup, the user must be in the WebWriteUser role
                    return Eval(context.Principal.HasClaim("role", "DMiVisionAdmin"));
                default:
                    return Nok();
            }
        }
    }
}