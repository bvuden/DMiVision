﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using System.Security.Claims;
using RestSharp;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{
    public abstract class BaseController : Controller
    {
        protected VisionContext _dbContext;

        public BaseController(VisionContext dbContext)
        {
            var created = dbContext.Database.EnsureCreated();
            _dbContext = dbContext;
        }

        protected string GetAuthenticatedUserId() => Request.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "sub").Value;
        
        protected string GetAuthenticatedUserName()
        {

            var userId = GetAuthenticatedUserId();
            // get userinfo from STS
            var uri = "http://" + Request.Host + "/api/users/" + userId;
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
                return (string)temp["Name"];

            }
            return string.Empty;
        }
    }
}
