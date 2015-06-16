using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.BridgeToVnext.Attributes;
using DMi.Vision.Api.Models;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {
        public UsersController(VisionContext dbContext)
            : base(dbContext)
        { }

        // GET api/values/5
        [ResourceAuthorize("Read", "Users")]
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var userInfo = new UserInfo(Request.HttpContext.User, _dbContext);

            // get userinfo from STS
            var uri = "https://dmiteststs.azurewebsites.net/connect/userinfo";
            var access_token = Request.Headers.First(x => x.Key == "Authorization").Value[0];

            // call sts userinfo endpoint to get profile information
            IRestClient client = new RestClient
            {
                BaseUrl = new Uri(uri)              
            };

            var request = new RestRequest();
            request.Method = Method.GET;
            request.AddHeader("Authorization", access_token);

            IRestResponse response = client.Execute(request);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var temp = JObject.Parse(response.Content);
                //make sure returned user is requesting user
                if ((string)temp["sub"] == userInfo.UserId)
                {
                    userInfo.Name = (string)temp["name"];
                    var roles = temp["role"].Children();
                    if (roles.Contains("DMiVisionAdmin")){
                        userInfo.IsAdmin = true;
                    }
                    return new ObjectResult(userInfo);
                }               
            }
            return new BadRequestResult();
        }
    }
}
